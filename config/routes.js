var homeController = require('../app/controllers/home'),
    serviceController = require('../app/controllers/service'),
    // Admin
    adminApisController = require('../app/controllers/admin/apis'),
    adminProcessorsController = require('../app/controllers/admin/processors');

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

    /*
     * ADMIN start
     */

    // API
    app.get((new RegExp('/' + adminApisController.path + '/([0-9a-z]+)/build')), adminApisController.build);
    crudRoutes(adminApisController);

    // Processors
    app.get((new RegExp('/' + adminProcessorsController.path + '/([\\w\\.]+)')), adminProcessorsController.show);
    app.get((new RegExp('/' + adminProcessorsController.path)), adminProcessorsController.index);

    /*
     * ADMIN end
     */


    // Serve an API.
    app.get((new RegExp('/api/([0-9a-z]+)(.(json|jsonp))?')), serviceController.api);
    app.get((new RegExp('/chart/([0-9a-z]+)')), serviceController.chart);

    // Home pages
    app.get((new RegExp('/api_builder/([0-9a-z]+)')), homeController.api_builder);
    app.get((new RegExp('/chart_builder/([0-9a-z]+)')), homeController.chart_builder);
    app.get('/', homeController.index);
};

module.exports = routes;
