var analytics_api = require("../../util/analytics_api"),
    mongoose = require('mongoose'),
    API = mongoose.model('API');

var homeController = (function () {
    "use strict";

    function index(req, res) {
        API.find(function (err, apis) {
            var total_records = 0;
            apis.forEach(function (api) { total_records += api.num_records; });

            res.render('home/index', { title: 'Home', apis: apis, total_records: total_records });
        });
    }

    function api_builder(req, res) {
        API.findById(req.params[0], function (err, api) {
            var api_url = analytics_api.build_url('api', api, req);

            res.render('home/api_builder', { title: api.title, api: api, api_url: api_url });
        });
    }

    function chart_builder(req, res) {
        API.findById(req.params[0], function (err, api) {
            var chart_url = analytics_api.build_url('chart', api, req);

            res.render('home/chart_builder', { title: 'New Chart', api: api, chart_url: chart_url });
        });
    }

    return {
        index : index,
        api_builder : api_builder,
        chart_builder : chart_builder
    };
}());

module.exports = homeController;