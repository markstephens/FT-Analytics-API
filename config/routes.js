var homeController = require('../app/controllers/home'),
    apisController = require('../app/controllers/apis'),
    chartsController = require('../app/controllers/charts');

var routes = function (app) {

    function crudRoutes(prefix, controller) {
        app.get((new RegExp('/' + prefix + '/([0-9a-z]+)/edit')), controller.update);
        app.put((new RegExp('/' + prefix + '/([0-9a-z]+)/edit')), controller.update);
        app.get((new RegExp('/' + prefix + '/new')), controller.create);
        app.post((new RegExp('/' + prefix + '/new')), controller.create);
        app.get((new RegExp('/' + prefix + '/([0-9a-z]+)')), controller.show);
        app.delete((new RegExp('/' + prefix + '/([0-9a-z]+)')), controller.destroy);
        app.get((new RegExp('/' + prefix)), controller.index);
    }

    // Charts
    crudRoutes('apis/([0-9a-z]+)/charts', chartsController);

    // API
    crudRoutes('apis', apisController);

    // Home pages
    app.get('/', homeController.index);
};

module.exports = routes;
