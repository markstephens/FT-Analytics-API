var merge = require('../../util/merge');

function linkHelpers(req, res, next) {

    function link_to(model, object, label, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            title : label,
            'class' : '',
            target: ''
        }, options);

        return '<a href="' + model + '/' + object._id + '" title="' + options.title + '" class="' + options['class'] + '" target="' + options.target + '">' + label + '</a>';
    }

    res.locals({
        link_to : link_to
    });

    next();
}

module.exports = linkHelpers;