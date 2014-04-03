var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    API = mongoose.model('API'),
    merge = require("../../util/merge"),
    Memcached = require('memcached'),
    analytics_api = require("../../util/analytics_api");

var serviceController = (function () {
    "use strict";

    var internal_params = ['date', 'callback', 'autogroup', 'groupby', 'chart_title', 'csv_title'];

    function render_json(req, res, memcached, cache_path) {
        var params = merge.object(req.query); // Take a copy if the object as we're about to remove the date

        API.findById(req.params[0], function (err, api) {
            if (err) {
                return res.send(404, err);
            }

            var groupings = [],
                date = params.date;

            // Remove predefined params from Mongo query
            internal_params.forEach(function (p) {
                if (params.hasOwnProperty(p)) {
                    delete params[p];
                }
            });

            api.getData(params, function (error, data) {
                if (error) {
                    return res.send(500, error);
                }

                var response,
                    headers,
                    expiry_time = api.next_update(),

                // Have to stringify and then parse the data as JS can't cope with a Date as an object's property if transforming later on. Sheesh.
                    grouped_data = JSON.parse(JSON.stringify(data));

                if (req.query.groupby) {
                    grouped_data = analytics_api.groupBy(req.query.groupby, grouped_data);

                    if (req.query.groupby instanceof Array) {
                        groupings = groupings.concat(req.query.groupby);
                    } else {
                        groupings = groupings.concat([req.query.groupby]);
                    }
                }
                if (req.query.autogroup) {
                    grouped_data = analytics_api.group(grouped_data);
                    groupings = groupings.concat(['autogroup']);
                }

                response = JSON.stringify({
                    name: api.title,
                    filters: merge.object({date: date + " days"}, params),
                    grouping: groupings,
                    num_results: analytics_api.obLength(grouped_data),
                    results: grouped_data
                });

                if (req.query.hasOwnProperty('callback')) {
                    response = 'function ' + req.query.callback + '() { return ' + response + '; }';
                }

                // Cache headers
                headers = {
                    'Content-Length': response.length,
                    'ETag': crypto.createHash('md5').update(response, 'utf8').digest('hex'),
                    'Expires': (new Date((new Date()).getTime() + expiry_time)).toUTCString(),
                    'Cache-Control': 'max-age=' + Math.floor(expiry_time / 1000)
                };

                // Save in cache for next time
                if (config.cache) {
                    memcached.set(cache_path, JSON.stringify({ headers : headers, response: response }), Math.floor(expiry_time / 1000), function (error) { if (error) { console.log(error); } });
                }

                res.set(headers);
                res.send(200, response);

            });

        });
    }

    function render_csv(req, res, memcached, cache_path) {
        var params = merge.object(req.query); // Take a copy if the object as we're about to remove the date

        API.findById(req.params[0], function (err, api) {
            if (err) {
                return res.send(404, err);
            }

            var date = params.date;

            // Remove predefined params from Mongo query
            internal_params.forEach(function (p) {
                if (params.hasOwnProperty(p)) {
                    delete params[p];
                }
            });

            api.getData(params, function (error, data) {
                if (error) {
                    return res.send(500, error);
                }

                var response,
                    csv = [],
                    headings,
                    headers,
                    expiry_time = api.next_update(),

                // Have to stringify and then parse the data as JS can't cope with a Date as an object's property if transforming later on. Sheesh.
                    grouped_data = JSON.parse(JSON.stringify(data));

                // Headers
                csv.push(['name', api.title]);
                csv.push(['filters', 'date', date + " days"]);
                csv.push(['num_results', analytics_api.obLength(grouped_data)]);

                csv.push([]);

                // Header row
                headings = Object.keys(grouped_data[0].data);
                csv.push(['Date'].concat(headings));

                grouped_data.forEach(function (d) {
                    csv.push([d.date].concat(headings.map(function (h) { return d.data[h]; })));
                });

                response = csv.map(function (row) { return "\"" + row.join('","') + "\""; }).join("\n");

                // Cache headers
                headers = {
                    'Content-Length': response.length,
                    'ETag': crypto.createHash('md5').update(response, 'utf8').digest('hex'),
                    'Expires': (new Date((new Date()).getTime() + expiry_time)).toUTCString(),
                    'Cache-Control': 'max-age=' + Math.floor(expiry_time / 1000)
                };

                // Save in cache for next time
                if (config.cache) {
                    memcached.set(cache_path, JSON.stringify({ headers : headers, response: response }), Math.floor(expiry_time / 1000), function (error) { if (error) { console.log(error); } });
                }

                res.set(headers);
                res.send(200, response);

            });

        });
    }

    function json(req, res) {
        // Common headers to send
        res.set({
            'Content-Type': 'application/' + (req.query.hasOwnProperty('callback') ? 'javascript' : 'json') + '; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Access-Control-Allow-Credentials': 'true'
        });

        if (config.cache) {
            var memcached = new Memcached(config.cache_server),
                cache_path = crypto.createHash('md5').update(req.url).digest('hex');

            memcached.get(cache_path, function (err, value) {
                if (value) {
                    value = JSON.parse(value.toString());

                    // Stored cache headers
                    res.set(value.headers);
                    res.set({ 'From-Cache' : 'true' }); // So we can tell what's going on
                    res.send(value.response);
                } else {
                    render_json(req, res, memcached, cache_path);
                }
            });
        } else {
            render_json(req, res);
        }
    }

    function csv(req, res) {
        // Common headers to send
        res.set({
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="' + req.query.csv_title.replace(/\W+/, '-').toLowerCase() + '_' + (new Date()).toISOString().replace('T', '-').replace(/\.\d+Z$/, '') + '.csv"'
        });

        if (config.cache) {
            var memcached = new Memcached(config.cache_server),
                cache_path = crypto.createHash('md5').update(req.url).digest('hex');

            memcached.get(cache_path, function (err, value) {
                if (value) {
                    value = JSON.parse(value.toString());

                    // Stored cache headers
                    res.set(value.headers);
                    res.set({ 'From-Cache' : 'true' }); // So we can tell what's going on
                    res.send(value.response);
                } else {
                    render_csv(req, res, memcached, cache_path);
                }
            });
        } else {
            render_csv(req, res);
        }
    }

    function chart(req, res) {
        API.findById(req.params[0], function (err, api) {
            var params = merge.object(req.query),
                api_url;

            delete req.query.chart_title;

            // Force a format????????
            delete req.query.autogroup;
            delete req.query.groupby;

            api_url = analytics_api.build_url('json', api, req);
            res.render('service/chart', { api_url: api_url, chart_title : params.chart_title || '', date : req.query.date || 7 });
        });
    }

    return {
        json : json,
        csv : csv,
        chart : chart
    };
}());

module.exports = serviceController;