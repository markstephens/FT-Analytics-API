var mongoose = require('mongoose'),
    API = mongoose.model('API');

var homeController = (function () {
    "use strict";

    function index(req, res) {
        var apis = API.find().sort({ name : 1 });
        res.render('home/index', { title: 'Home', apis: apis });
    }

    function show(req, res) {
        res.render('home/show', { title: 'Home' });
    }

    return {
        index : index,
        show : show
    };
}());

module.exports = homeController;