var fs = require('fs'),
    pathModule = require('path');

var adminProcessorsController = (function () {
    "use strict";

    var path = 'admin/processors',
        view_path = 'admin/processors';

    function index(req, res) {
        var processors = [];

        fs.readdirSync(pathModule.normalize(__dirname + '../../../processor/brand')).forEach(function (file) {
            if (file.indexOf('.js') !== -1) {
                processors.push(file);
            }
        });

        res.render(view_path + '/index', { title: 'Processors', processors: processors });
    }

    function show(req, res) {
        API.findById(req.params[0], function (err, api) {
            if (typeof req.param('populateData') !== "undefined") {
                api.populateData();

                req.flash('success', api.title + ' API is checking for data. Please wait...');
                return res.redirect('/' + path + '/' + api._id);
            }

            res.render(view_path + '/show', { title: api.title, api: api });
        });
    }

    return {
        path: path,
        index : index,
        show : show
    };
}());

module.exports = adminProcessorsController;