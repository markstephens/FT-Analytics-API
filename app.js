/**
 * Module dependencies.
 */

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    express = require('express'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models',
    i;

// db connection
mongoose.connect(config.db);

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

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}