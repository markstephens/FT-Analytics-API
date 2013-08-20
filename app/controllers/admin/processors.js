var fs = require('fs'),
    pathModule = require('path');

var adminProcessorsController = (function () {
    "use strict";

    var path = 'admin/processors',
        view_path = 'admin/processors',
        processors = [];

    fs.readdirSync(pathModule.normalize(__dirname + '../../../processor/brand')).forEach(function (file) {
        if (file.indexOf('.js') !== -1) {
            processors.push(file);
        }
    });

    function index(req, res) {
        res.render(view_path + '/index', { title: 'Processors', processors: processors });
    }

    function show(req, res) {
        var index = processors.indexOf(req.params[0]),
            processor;

        if (index > -1) {
            processor = {
                title: processors[index],
                conditions: require(pathModule.normalize(__dirname + '../../../processor/brand/' + processors[index])).can_process.toString()
            };
            return res.render(view_path + '/show', { title: processor.title, processor: processor });
        } else {
            return res.redirect('/' + path);
        }
    }

    return {
        path: path,
        index : index,
        show : show
    };
}());

module.exports = adminProcessorsController;