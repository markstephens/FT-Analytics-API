var mongoose = require('mongoose'),
    API = mongoose.model('API'),
    Chart = mongoose.model('Chart');

var chartsController = (function () {
    "use strict";

    var path = 'charts',
        view_path = 'charts';

    function index(req, res) {
        Chart.find(function (err, charts) {
            res.render(view_path + '/index', { title: 'Charts', charts: charts });
        });
    }

    function show(req, res) {
        Chart.findById(req.params[0], function (err, chart) {
            res.render(view_path + '/show', { title: chart.title, chart: chart });
        });
    }

    function create(req, res) {
        var chart, api;

        API.find(function (err, apis) {
            if (req.method === 'POST') {
                chart = new Chart(req.param('chart'));

                chart.save(function (error) {
                    if (error) {
                        res.flash('error', error);
                        return res.render(view_path + '/create', { title: 'New Chart', chart: chart, apis: apis });
                    }

                    req.flash('success', chart.title + ' Chart successfully created');
                    return res.redirect(path.replace('([0-9a-z]+)', api._id) + '/' + chart._id);
                });
            } else {
                chart = new Chart();
                if (req.query.api) {
                    apis.forEach(function (a) {
                        if (a._id.toString() === req.query.api) {
                            api = a;
                        }
                    });
                }

                return res.render(view_path + '/create', { title: 'New Chart', chart: chart, apis: apis, api: api });
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