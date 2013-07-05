var mongoose = require('mongoose'),
    API = mongoose.model('API');

var apisController = (function () {
    "use strict";

    function index(req, res) {
        var apis = API.find().sort({ name : 1 });
        res.render('apis/index', { title: 'APIs', apis: apis });
    }

    function show(req, res) {
        res.send(200, 'Show');
    }

    function create(req, res) {
        var api;

        if (req.method === 'POST') {
            console.log('API params', req.param('api'));

            api = new API(req.param('api'));

            api.save(function (error) {
                if (error) {
                    return res.render('apis/create', { title: 'New API', api: api, error : error });
                }

                return res.redirect('/apis/' + api._id);
            });
        } else {
            api = new API();
            return res.render('apis/create', { title: 'New API', api: api });
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