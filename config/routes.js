var homeController = require('../app/controllers/home'),
    apisController = require('../app/controllers/apis');

var routes = function (app) {

    function crudRoutes(prefix, controller) {
        app.get((new RegExp('/' + prefix + '/([0-9a-z]+)/edit')), controller.update);
        app.post((new RegExp('/' + prefix + '/([0-9a-z]+)/edit')), controller.update);
        app.get('/' + prefix + '/new', controller.create);
        app.post('/' + prefix + '/new', controller.create);
        app.get((new RegExp('/' + prefix + '/([0-9a-z]+)')), controller.show);
        app.delete((new RegExp('/' + prefix + '/([0-9a-z]+)')), controller.destroy);
        app.get('/' + prefix, controller.index);
    }

    // API
    crudRoutes('apis', apisController);

    // Home pages
    app.get('/', homeController.index);
};

module.exports = routes;
