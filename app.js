"use strict";

require('colors');

var cluster = require('cluster'),
    util = require('util'),
    mongoose = require('mongoose'),
    numCPUs = require('os').cpus().length,
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    i;

process.title = 'AnAPI';

if (cluster.isMaster) {
    util.puts('\n=====================================================\n FT Analytics API\n=====================================================\n'.cyan);

    if (config.cache) {
        util.puts('Caching using MemCache is enabled. ' + '[ OK ]'.green);
    } else {
        util.puts('Caching using MemCache is disabled. ' + '[ OK ]'.green);
    }

    var connection = mongoose.createConnection(config.db);

    connection.on("error", function (error) {
        console.error('MongoDB: ', error.toString().red);
        process.exit(1);
    });

    connection.once('open', function () {
        console.log("MongoDB: " + '[ OK ]'.green);
        util.puts('\nStarting ' + numCPUs + ' workers as "' + process.title + '" (' + process.pid + '):');

        // Fork workers.
        for (i = 0; i < numCPUs; i = i + 1) {
            cluster.fork();
        }

        cluster.on('exit', function (worker) {
            util.error(('Worker ' + worker.process.pid + ' died.').red);
            cluster.fork();
        });
    });
} else {
    require('./config/express')(env, config);
}
