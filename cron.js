/**
 * Module dependencies.
 */

var util = require('util'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models',
    processors_path = config.root + '/app/processor/brand',
    ok = '\t\033[32m[ OK ]\033[m',
    fail = '\t\033[31m[ FAIL ]\033[m';

process.title = 'cronAapi';

// db connection
mongoose.connect(config.db);

/*
 * Print out startup information and requirements
 */
util.puts('\n=====================================================\n \033[36mAnalytics API Cron\033[m\n=====================================================\n');

if (mongoose.CONNREFUSED) {
    util.error('MongoDB server not found.' + fail);
    process.exit(1);
} else {
    util.puts('MongoDB server found.' + ok);
}

util.puts('Parsers:');
// Processors startup reqs
fs.readdirSync(processors_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        require(processors_path + '/' + file).startup_requirements(util);
    }
});

/*
 * End of startup reqs.
 */

// Load models
fs.readdirSync(models_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        require(models_path + '/' + file);
    }
});

util.puts('Running cron:');

require('./config/cron');