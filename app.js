/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose'),
    models_path = config.root + '/app/models';

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

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
