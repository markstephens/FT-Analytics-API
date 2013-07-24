var mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Chart = mongoose.model('Chart');

var chartsController = (function () {
    "use strict";

    var path = 'admin/apis/([0-9a-z]+)/charts',
        view_path = 'admin/charts';

    function index(req, res) {
        API.findById(req.params[0]).populate('charts').exec(function (err, api) {
            res.render(view_path + '/index', { title: 'Charts for ' + api.title, api: api });
        });
    }

    function show(req, res) {
        API.findById(req.params[0], function (err, api) {
            res.render(view_path + '/show', { title: api.title, api: api });
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
                        return res.render(view_path + '/create', { title: 'New Chart for ' + api.title, api: api, chart: chart });
                    }

                    req.flash('success', chart.title + ' Chart successfully created');
                    return res.redirect(path.replace('([0-9a-z]+)', api._id) + '/' + chart._id);
                });
            } else {
                chart = new Chart();
                return res.render(view_path + '/create', { title: 'New Chart for ' + api.title, api: api, chart: chart });
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
        path : path,
        index : index,
        show : show,
        create : create,
        update : update,
        destroy : destroy
    };
}());

module.exports = chartsController;