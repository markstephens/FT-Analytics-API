
var merge = require('../util/merge'),
    path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = (function () {
    "use strict";

    var default_config = {
        db: 'mongodb://localhost/analytics_api',
        cache: false,
        root: rootPath,
        app: {
            name: 'FT Analytics API'
        }
    };

    return {
        development: merge.object(default_config),
        test: merge.object(default_config, {
            db: 'mongodb://localhost/analytics_api_test'
        }),
        production: merge.object(default_config, {
            //db: process.env.MONGOLAB_URI,
            cache: true
        })
    };
}());

module.exports = config;
