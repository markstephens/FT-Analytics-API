var util = require('util');

function generalHelpers(req, res, next) {

    function inspect(object) {
        return util.inspect(object, { showHidden: true, depth: null });
    }

    // Is the supplied link the current url?
    function isActive(link) {
        return req.url.indexOf(link) !== -1;
    }

    res.locals({
        inspect : inspect,
        util : util,
        isActive : isActive
    });

    next();
}

module.exports = generalHelpers;