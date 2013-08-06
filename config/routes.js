var homeController = require('../app/controllers/home'),
    apiController = require('../app/controllers/api'),
    // Admin
    adminApisController = require('../app/controllers/admin/apis'),
    adminChartsController = require('../app/controllers/admin/charts');

var routes = function (app) {

    function crudRoutes(controller) {
        app.get((new RegExp('/' + controller.path + '/([0-9a-z]+)/edit')),  controller.update);
        app.put((new RegExp('/' + controller.path + '/([0-9a-z]+)/edit')),  controller.update);
        app.get((new RegExp('/' + controller.path + '/new')),               controller.create);
        app.post((new RegExp('/' + controller.path + '/new')),               controller.create);
        app.get((new RegExp('/' + controller.path + '/([0-9a-z]+)')),       controller.show);
        app.delete((new RegExp('/' + controller.path + '/([0-9a-z]+)')),       controller.destroy);
        app.get((new RegExp('/' + controller.path)),                        controller.index);
    }

    // Charts
    crudRoutes(adminChartsController);

    // API
    app.get((new RegExp('/' + adminApisController.path + '/([0-9a-z]+)/build')), adminApisController.build);
    crudRoutes(adminApisController);

    // Serve an API.
    app.get((new RegExp('/api/([0-9a-z]+)')), apiController.show);

    // Home pages
    app.get((new RegExp('/builder/([0-9a-z]+)')), homeController.builder);
    app.get('/', homeController.index);
};

module.exports = routes;
