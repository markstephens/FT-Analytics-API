var curl = require("../../util/curl"),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env];


var processor = (function () {

    var brands_path = config.root + '/app/processor/brand';

    function getData(url, callback) {
        curl.data(url, function (response, data) {
            if (response.statusCode === 200) {
                callback({
                    url: url,
                    data: data
                });
            }
        });
    }

    function head(url, callback) {
        getData(url, function (data) {
            fs.readdirSync(brands_path).forEach(function (file) {
                if (file.indexOf('.js') !== -1) {
                    var brand = require(brands_path + '/' + file);
                    brand.can_process(data, callback);
                }
            });
        });
    }

    function process(model, callback) {
        getData(model.dataUrl, function (data) {
            fs.readdirSync(brands_path).forEach(function (file) {
                if (file.indexOf('.js') !== -1) {
                    var brand = require(brands_path + '/' + file);

                    brand.can_process(data, function (result) {
                        if (result.date > model.lastDataUpdate) {
                            brand.process(model.columns, result, callback);
                        } else {
                            console.log('No new data found');
                        }
                    });
                }
            });
        });
    }

    return {
        head : head,
        process : process
    };
}());

module.exports = processor;