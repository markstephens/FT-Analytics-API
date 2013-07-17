var curl = require("../../util/curl"),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env];


var processor = (function () {

    var brands_path = config.root + '/app/processor/brand';

    function getData(url, callback) {
        console.log('processor.js', 'Getting data');

        curl.data(url, function (response, data) {
            console.log('processor.js', 'Got data', response.statusCode);

            if (response.statusCode === 200) {
                callback(data);
            }
        });
    }

    function process(model, callback) {
        getData(model.dataUrl, function (data) {
            fs.readdirSync(brands_path).forEach(function (file) {
                if (file.indexOf('.js') !== -1) {
                    console.log('processor.js', 'Loading processor ' + file);

                    var brand = require(brands_path + '/' + file);
                    brand.can_process(data, function (result) {
                        console.log('processor.js', file + ' can process!');
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
        getData : getData,
        process : process
    };
}());

module.exports = processor;