"use strict";

var util = require('util'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models',
    fail = '\t[ FAIL ]';

process.title = 'cronAapi';

// db connection
mongoose.connect(config.db);

/*
 * Print out startup information and requirements
 */
util.puts((new Date()) + ' - ' + process.argv[2]);

if (mongoose.CONNREFUSED) {
    util.error('MongoDB server not found.' + fail);
    process.exit(1);
}

// Load models
fs.readdirSync(models_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        require(models_path + '/' + file);
    }
});

require('./update');