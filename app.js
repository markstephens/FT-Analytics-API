"use strict";

/**
 * Module dependencies.
 */

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    util = require('util'),
    express = require('express'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models',
    processors_path = config.root + '/app/processor/brand',
    i,
    ok = '\t[ OK ]',
    fail = '\t[ FAIL ]';

process.title = 'nodeAapi';

// db connection
mongoose.connect(config.db);

/*
 * Print out startup information and requirements
 */
if (cluster.isMaster) {
    util.puts('\n=====================================================\n Analytics API\n=====================================================\n');

    if (mongoose.CONNREFUSED) {
        util.error('MongoDB server not found.' + fail);
        process.exit(1);
    } else {
        util.puts('MongoDB server found.' + ok);
    }

    if (config.cache) {
        /*if () {
         util.error('Caching using MemCache is enabled, but MemCache server not found.\t[ FAIL ]');
         process.exit(1);
         } else {*/
        util.puts('Caching using MemCache is enabled.' + ok);
        //}
    } else {
        util.puts('Caching using MemCache is disabled.' + ok);
    }

    util.puts('Parsers:');
// Processors startup reqs
    fs.readdirSync(processors_path).forEach(function (file) {
        if (file.indexOf('.js') !== -1) {
            require(processors_path + '/' + file).startup_requirements(util);
        }
    });

    util.puts('\nStarting ' + numCPUs + ' workers as "' + process.title + '" (' + process.pid + '):');
}
/*
 * End of startup reqs.
 */

// Load models
fs.readdirSync(models_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        require(models_path + '/' + file);
    }
});

var app = express();

// Have to do this to wait for the models above to load first.
require('./config/express')(app, env, config);

// Initialise routes
require('./config/routes')(app);

if (cluster.isMaster) {
    // Fork workers.
    for (i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        util.error('Worker ' + worker.process.pid + ' died.');
        cluster.fork();
    });
} else {
    app.listen(app.get('port'), function () {
        util.puts(' - Worker listening on port ' + app.get('port') + '.' + ok);
    });
}