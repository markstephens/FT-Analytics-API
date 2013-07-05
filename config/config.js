
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = (function () {
    "use strict";

    var default_config = {
        db: 'mongodb://localhost/analytics_api',
        root: rootPath,
        app: {
            name: 'FT Analytics API'
        }
    };

    function clone(target, options) {
        if (!options) {
            options = target;
            target = {};
        }

        var name, src, copy;

        for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target === copy) {
                continue;
            }

            // Gets rid of missing values too
            if (typeof copy !== "undefined" && copy !== null) {
                target[name] = copy;
            }
        }

        return target;
    }

    return {
        development: clone(default_config),
        test: clone(default_config, {
            db: 'mongodb://localhost/analytics_api_test'
        }),
        production: clone(default_config, {
            db: process.env.MONGOLAB_URI
        })
    };
}());

module.exports = config;
