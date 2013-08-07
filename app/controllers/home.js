var mongoose = require('mongoose'),
    API = mongoose.model('API');

var homeController = (function () {
    "use strict";

    function index(req, res) {
        API.find(function (err, apis) {
            res.render('home/index', { title: 'Home', apis: apis });
        });
    }

    function builder(req, res) {
        API.findById(req.params[0], function (err, api) {
            var api_url = 'http://' + req.headers.host + '/api/' + api._id,
                qs = [],
                key;

            for (key in req.query) {
                if (req.query.hasOwnProperty(key)) {
                    if (req.query[key].trim() !== '') {
                        qs.push(key + '=' + req.query[key]);
                    }
                }
            }

            if (qs.length > 0) {
                api_url = api_url + '?' + qs.join('&');
            }

            res.render('home/builder', { title: api.title, api: api, api_url: api_url });
        });
    }

    return {
        index : index,
        builder : builder
    };
}());

module.exports = homeController;