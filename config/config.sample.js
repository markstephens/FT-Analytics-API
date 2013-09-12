
var merge = require('../util/merge'),
    path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = (function () {
    "use strict";

    var default_config = {
        db: 'mongodb://localhost/analytics_api',
        cache: false,
        cache_server: "localhost:11211",
        root: rootPath,
        app: {
            name: 'FT Analytics API'
        },
        port: 3000,
        http_proxy : {
            host : '',
            port : ''
        },
        https_proxy : {
            host : '',
            port : ''
        },
        processors : {
            ijento : {
                auth : process.env.IJENTO_AUTH
            }
        }
    };

    return {
        development: merge.object(default_config),
        test: merge.object(default_config, {
            db: 'mongodb://localhost/analytics_api_test'
        }),
        production: merge.object(default_config, {
            cache: true,
            port: 5000
        })
    };
}());

module.exports = config;
