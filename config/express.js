"use strict";

require('colors');

var express = require('express'),
    http = require('http'),
    util = require('util'),
    mongoose = require('mongoose');

module.exports = function (env, config) {
    mongoose.connect(config.db);

    var db = mongoose.connection,
        app;

    db.on('error', function (error) {
        throw new Error("Can't connect to DB:" + error);
    });

    // Load models
    require('../app/models/api');
    require('../app/models/data');

    app = express();

    // all environments
    app.set('title', config.app.name);
    app.set('port', config.port || 3000);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());

    // Use nginx for compression in prod
    if (app.get('env') !== 'production') {
        app.use(express.compress());
    }

    app.use(express.methodOverride());
    app.use(express.cookieParser('4n4lyt1cs 4p1'));
    app.use(express.session());
    app.use(express.csrf());
    app.use(require('flashify'));

    // Load view helpers
    app.use(require('../app/helpers/general'));
    app.use(require('../app/helpers/links'));
    app.use(require('../app/helpers/forms'));

    app.use(app.router);

    // development only
    if ('development' === app.get('env')) {
        app.locals.pretty = true;
        app.use(express.errorHandler());
    }

    app.set('version', require('../package.json').version);

    // Static
    app.use(express.static(config.root + '/public'));

    // Routes
    require(config.root + '/config/routes')(app);

    http.createServer(app).listen(app.get('port'), function () {
        util.puts(' - Worker listening on port ' + app.get('port') + '. ' + '[ OK ]'.green);
    });
};

