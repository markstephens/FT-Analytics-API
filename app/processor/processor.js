"use strict";

var curl = require("../../util/curl"),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env];

var processor = (function () {

    var processors_path = config.root + '/app/processor/brand',
        processors = [];

    fs.readdirSync(processors_path).forEach(function (file) {
        if (file.indexOf('.js') !== -1) {
            processors.push(require(processors_path + '/' + file));
        }
    });

    function getData(url, callback) {
        processors.forEach(function (processor) {
            if (processor.can_get(url)) {
                curl.data(url, processor.can_get(url), function (err, response, data) {
                    if (err) {
                        return callback(err);
                    }

                    if (response.statusCode === 200) {
                        return callback(null, {
                            url: url,
                            data: data
                        });
                    }

                    console.log('Error fetching:', url, response.statusCode);
                    return callback(response);
                });
            }
        });
    }

    function head(url, callback) {
        getData(url, callback);
    }

    function process(model, callback) {
        getData(model.dataUrl, function (error, data) {
            if (error) {
                return callback();
            }

            processors.forEach(function (processor) {
                processor.can_process(data, function (result) {
                    if (result.date > model.lastDataUpdate) {
                        processor.process(model.columns, result, callback);
                    } else {
                        console.log('No new data found');
                        callback();
                    }
                });
            });
        });
    }

    return {
        head : head,
        process : process
    };
}());

module.exports = processor;