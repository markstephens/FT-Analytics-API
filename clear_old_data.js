"use strict";

/**
 * Module dependencies.
 */

var util = require('util'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models',
    fail = '\t[ FAIL ]',

    days = process.argv[2];

process.title = 'AaClean';

days = Math.abs(parseInt(days, 10));

if (!(days && days > 0)) {
    util.error("Invalid timeframe used, should be number of days as the first argument.");
    process.exit(1);
}

// db connection
mongoose.connect(config.db);

/*
 * Print out startup information and requirements
 */
util.puts((new Date()) + ' - ' + days + ' days');

if (mongoose.CONNREFUSED) {
    util.error('MongoDB server not found.' + fail);
    process.exit(1);
}

// Load models
require(models_path + '/api.js');
require(models_path + '/data.js');

var API = mongoose.model('API'),
    Data = mongoose.model('Data'),
    finished_apis = 0;

Data.clearDataOlderThan(days, function (res) {
    util.puts(res + " records deleted.");

    API.find(function (err, apis) {
        if (err) {
            util.error("Error looking up APIs");
            util.error(err);
            process.exit(1);
        } else {
            if (apis.length === 0) {
                //util.puts('No apis found');
                mongoose.disconnect();
                process.exit(0);
            }

            apis.forEach(function (api) {
                api.redo_count_cache(function () {
                    finished_apis += 1;

                    if (finished_apis === apis.length) {
                        mongoose.disconnect();
                        process.exit(0);
                    }
                });
            });
        }
    });
});




