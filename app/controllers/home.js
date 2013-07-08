var mongoose = require('mongoose'),
    API = mongoose.model('API');

var homeController = (function () {
    "use strict";

    function index(req, res) {
        API.find(function (err, apis) {
            res.render('home/index', { title: 'Home', apis: apis });
        });
    }

    return {
        index : index
    };
}());

module.exports = homeController;