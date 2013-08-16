var crypto = require('crypto'),
    mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Data = mongoose.model('Data'),
    merge = require("../../util/merge"),
    MemJS = require("memjs").Client,
    d3 = require('d3');

var serviceController = (function () {
    "use strict";

    function obLength(obj) {
        var length = 0, key;
        for (key in obj ) {
            if (obj.hasOwnProperty(key)) {
                length = length + 1;
            }
        }
        return length;
    }

    function api(req, res) {
        var memjs = MemJS.create(),
            md5 = crypto.createHash('md5'),
            cache_path = 'TODO';

        // Common headers to send
        res.set({
            'Content-Type': 'application/' + (req.query.hasOwnProperty('callback') ? 'script' : 'json') + '; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With',
            'Access-Control-Allow-Credentials': 'true'
        });

        /*memjs.get(cache_path, function (err, value) {
         console.log('MEMJS: ', value);

         if (value) {
         // Stored cache headers
         res.set(value.headers);
         res.set({ 'From-Cache' : 'true' });
         res.send(value.response.toString());
         } else {*/
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

                if (obLength(params) > 0) {
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
                        var response = JSON.stringify({
                                name: api.title,
                                query: merge.object({date: date + " days"}, params),
                                num_results: data.length,
                                results: data
                            }),
                            headers,
                            expiry_time = (60 * 60 * 12); // TODO set this properly - depending on update interval

                        if (req.query.hasOwnProperty('callback')) {
                            response = 'function ' + req.query.callback + '() { return ' + response + '; }';
                        }

                        // Cache headers
                        headers = {
                            'Content-Length': response.length,
                            'ETag': md5.update(response, 'utf8').digest('hex'),
                            'Expires': (new Date((new Date()).getTime() + (1000 * expiry_time))).toUTCString(),
                            'Cache-Control': 'max-age=' + expiry_time
                        };

                        // Save in cache for next time
                        memjs.set(cache_path, { headers : headers, response: response }, function () {}, expiry_time);

                        res.set(headers);
                        res.send(200, response);
                    }
                });
            }
        });
        /*}
         });*/
    }

    function chart(req, res) {

    }

    return {
        api : api,
        chart : chart
    };
}());

module.exports = serviceController;