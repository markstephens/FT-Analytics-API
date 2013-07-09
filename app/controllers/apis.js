var curl = require("../../util/curl"),
    mongoose = require('mongoose'),
    API = mongoose.model('API');

var apisController = (function () {
    "use strict";

    function index(req, res) {
        API.find(function (err, apis) {
            console.log(apis);

            res.render('apis/index', { title: 'APIs', apis: apis });
        });
    }

    function show(req, res) {
        console.log(req.params);
        API.findById(req.params[0], function (err, api) {
            res.render('apis/show', { title: 'APIs', api: api });
        });
    }

    function create(req, res) {
        var api;

        if (req.method === 'POST') {
            console.log('API params', req.param('api'));

            api = new API(req.param('api'));

            api.save(function (error) {
                if (error) {
                    console.log(error);
                    res.locals.errors = error;
                    return res.render('apis/create', { title: 'New API', api: api });
                }

                return res.redirect('/apis/' + api._id);
            });
        } else {
            if (req.xhr) {
                curl.data(req.query.url, function (response, data) {
                    res.set('Content-Type', response.headers['content-type']);
                    return res.send(response.statusCode, data);
                });
            } else {
                api = new API();
                return res.render('apis/create', { title: 'New API', api: api });
            }
        }
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

module.exports = apisController;