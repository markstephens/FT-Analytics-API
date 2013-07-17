var util = require('util');

function generalHelpers(req, res, next) {

    var flash_types = ['error', 'success', 'warning', 'info'];

    function messages() {
        var html = [];
        if (typeof res.locals.flash !== "undefined") {
            flash_types.forEach(function (type) {
                if (typeof res.locals.flash[type] !== "undefined") {
                    html.push('<div class="alert alert-' + type + '">' + res.locals.flash[type] + '</div>');
                }
            });
        }
        /*if (typeof req.locals !== "undefined") {
            flash_types.forEach(function (type) {
                if (typeof req.locals[type] !== "undefined") {
                    html.push('<div class="alert alert-' + type + '">' + req.locals[type] + '</div>');
                }
            });
        }*/

        return html.join('');
    }

    function inspect(object) {
        return util.inspect(object, { showHidden: true, depth: null });
    }

    // Is the supplied link the current url?
    function isActive(link) {
        return (new RegExp(link)).test(req.url);
    }

    function format(text) {
        return text.replace(/\n/g, '<br />');
    }

    res.locals({
        req : req,
        messages : messages,
        inspect : inspect,
        util : util,
        isActive : isActive,
        format : format
    });

    next();
}

module.exports = generalHelpers;