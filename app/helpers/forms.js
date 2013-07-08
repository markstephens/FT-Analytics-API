var merge = require('../../util/merge');

function formHelpers(req, res, next) {

    if (typeof req.flash !== 'undefined') {
        res.locals.info = req.flash('info');
        res.locals.errors = req.flash('errors');
        res.locals.success = req.flash('success');
        res.locals.warning = req.flash('warning');
    }

    function label_for(model, field, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            label : field,
            'class' : 'control-label'
        }, options);

        return '<label for="' + model + '_' + field + '" class="' + options['class'] + '">' + options.label + '</label>';
    }

    function text_field_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            type : 'text',
            placeholder : field,
            required : false
        }, options);

        return '<input type="' + options.type + '" id="' + model + '_' + field + '" name="' + model + '[' + field + ']" placeholder="' + options.placeholder + '" value="' + value + '" ' + (options.required ? 'required="required"' : '') + ' />';
    }

    function text_area_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            placeholder : field,
            required : false,
            rows : 3
        }, options);

        return '<textarea id="' + model + '_' + field + '" name="' + model + '[' + field + ']" placeholder="' + options.placeholder + '" rows="' + options.rows + '">' + value + '</textarea>';
    }

    res.locals({
        label_for : label_for,
        text_field_for : text_field_for,
        text_area_for : text_area_for
    });

    next();
}

module.exports = formHelpers;