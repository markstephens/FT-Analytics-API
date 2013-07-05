var homeController = require('../app/controllers/home');

module.exports = function (app) {
    // Home pages
    app.get('/', homeController.index);
    app.get('/show/:api', homeController.show);

    // API
    // ...

    // Admin
    // ...
};