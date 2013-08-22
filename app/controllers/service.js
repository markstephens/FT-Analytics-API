var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Data = mongoose.model('Data'),
    merge = require("../../util/merge"),
    MemJS = require("memjs").Client,
    analytics_api = require("../../util/analytics_api");

var serviceController = (function () {
    "use strict";

    function render_api(req, res, memJS, cache_path) {
        API.findById(req.params[0], function (err, api) {
            if (err) {
                res.send(404, err);
            } else {
                var date = 1,
                    query = {},
                    params = merge.object(req.query), // Take a copy if the object as we're about to remove the date
                    param_key;

                if (typeof req.query.date !== "undefined") {
                    if (req.query.date.trim() !== '') {
                        date = req.query.date;
                    }
                    delete params.date;
                }

                // Remove predefined params from Mongo query
                ['callback', 'autogroup', 'groupby'].forEach(function (p) {
                    if (params.hasOwnProperty(p)) {
                        delete params[p];
                    }
                });

                if (analytics_api.obLength(params) > 0) {
                    for (param_key in params) {
                        if (params.hasOwnProperty(param_key)) {
                            if (params[param_key].trim() !== '') {
                                query['data.' + param_key] = params[param_key];
                            } else {
                                delete params[param_key];
                            }
                        }
                    }

                    console.log('QUERY: ', merge.object(query, { _api : api._id }));
                }

                Data.filterByRelativeDate(date).find(merge.object(query, { _api : api._id })).select("-_id -_api -__v").exec(function (err, data) {
                    if (err) {
                        res.send(500, err);
                    } else {
                        var response,
                            headers,
                            expiry_time = (60 * 60 * 12), // TODO set this properly - depending on update interval
                        // Have to stringify and then parse the data as JS can't cope with a Date as an object's property if transforming later on. Sheesh.
                            grouped_data = JSON.parse(JSON.stringify(data));

                        if (req.query.groupby) {
                            grouped_data = analytics_api.groupBy(req.query.groupby, grouped_data);
                        }
                        if (req.query.autogroup) {
                            grouped_data = analytics_api.group(grouped_data);
                        }

                        response = JSON.stringify({
                            name: api.title,
                            query: merge.object({date: date + " days"}, params),
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
                            'Expires': (new Date((new Date()).getTime() + (1000 * expiry_time))).toUTCString(),
                            'Cache-Control': 'max-age=' + expiry_time
                        };

                        // Save in cache for next time
                        if (config.cache) {
                            memJS.set(cache_path, JSON.stringify({ headers : headers, response: response }), function () {}, expiry_time);
                        }

                        res.set(headers);
                        res.send(200, response);
                    }
                });
            }
        });
    }

    function api(req, res) {
        // Common headers to send
        res.set({
            'Content-Type': 'application/' + (req.query.hasOwnProperty('callback') ? 'javascript' : 'json') + '; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Access-Control-Allow-Credentials': 'true'
        });

        if (config.cache) {
            var memJS = MemJS.create(),
                cache_path = crypto.createHash('md5').update(req.url).digest('hex');

            memJS.get(cache_path, function (err, value) {
                if (value) {
                    value = JSON.parse(value.toString());

                    // Stored cache headers
                    res.set(value.headers);
                    res.set({ 'From-Cache' : 'true' }); // So we can tell what's going on
                    res.send(value.response);
                } else {
                    render_api(req, res, memJS, cache_path);
                }
            });
        } else {
            render_api(req, res);
        }
    }

    function chart(req, res) {
        API.findById(req.params[0], function (err, api) {
            var api_url = analytics_api.build_url('api', api, req),
                params = merge.object(req.query);

            delete params.chart_title;
            delete params.date;

            res.render('service/chart', { api_url: api_url, chart_title : req.query.chart_title || '', date : req.query.date || 1, params : params });
        });
    }

    return {
        api : api,
        chart : chart
    };
}());

module.exports = serviceController;