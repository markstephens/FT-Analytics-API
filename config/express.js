var express = require('express'),
    fs = require('fs');

module.exports = function (app, env, config) {

    app.set('title', config.app.name);
    app.set('port', process.env.PORT || 3000);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    // TODO app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //app.use(express.cookieParser('your secret here'));
    //app.use(express.session());

    // Load view helpers
    var helpers_path = config.root + '/app/helpers';
    fs.readdirSync(helpers_path).forEach(function (file) {
        if (file.indexOf('.js') !== -1) {
            app.use(require(helpers_path + '/' + file));
        }
    });

    app.use(app.router);
    app.use(express.static(config.root + '/public'));

    // development only
    if ('development' === env) {
        app.locals.pretty = true;
        app.use(express.errorHandler());
    }

};

