var mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Chart = mongoose.model('Chart');

var chartsController = (function () {
    "use strict";

    function index(req, res) {
        API.findById(req.params[0]).populate('charts').exec(function (err, api) {
            res.render('charts/index', { title: 'Charts for ' + api.title, api: api });
        });
    }

    function show(req, res) {
        API.findById(req.params[0], function (err, api) {
            if (typeof req.param('populateData') !== "undefined") {
                api.populateData();

                req.flash('info', api.title + ' API is checking for data. Please wait...');
                return res.redirect('/apis/' + api._id);
            }

            res.render('apis/show', { title: api.title, api: api });
        });
    }

    function create(req, res) {
        API.findById(req.params[0], function (err, api) {
            var chart;

            if (req.method === 'POST') {
                chart = new Chart(req.param('chart'));

                chart.save(function (error) {
                    if (error) {
                        res.flash('error', error);
                        return res.render('charts/create', { title: 'New Chart for ' + api.title, api: api, chart: chart });
                    }

                    req.flash('success', chart.title + ' Chart successfully created');
                    return res.redirect('/apis/' + api._id + '/charts/' + chart._id);
                });
            } else {
                chart = new Chart();
                return res.render('charts/create', { title: 'New Chart for ' + api.title, api: api, chart: chart });
            }

        });
    }

    function update(req, res) {
        res.send(200, 'Update');
    }

    function destroy(req, res) {
        res.send(200, 'Destroy');
    }

    return {
        index : index,
        show : show,
        create : create,
        update : update,
        destroy : destroy
    };
}());

module.exports = chartsController;