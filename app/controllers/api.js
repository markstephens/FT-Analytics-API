var mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Data = mongoose.model('Data'),
    merge = require("../../util/merge");

var apiController = (function () {
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

    function show(req, res) {
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
                        // Cache headers
                        // res.headers();
                        res.send(200, {
                            name: api.title,
                            query: merge.object({date: date + " days"}, params),
                            num_results: data.length,
                            results: data
                        });
                    }
                });
            }
        });
    }

    return {
        show : show
    };
}());

module.exports = apiController;