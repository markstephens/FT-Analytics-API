var merge = require('../../util/merge');

function linkHelpers(req, res, next) {

    function relative_url(current_url, new_path) {
        if (typeof new_path === "undefined") {
            new_path = current_url;
            current_url = req.url;
        }

        return current_url.replace(/\/$/, '') + '/' + new_path;
    }

    function back_link(options) {
        options = merge.object({
            'class' : 'btn btn-default'
        }, options);

        return '<a href="' + req.url.replace(/\/[^\/]+$/, '') + '" class="' + options['class'] + '">Back</a>';
    }

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
        relative_url : relative_url,
        back_link : back_link,
        link_to : link_to
    });

    next();
}

module.exports = linkHelpers;