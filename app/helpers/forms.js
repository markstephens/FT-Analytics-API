var merge = require('../../util/merge');

function formHelpers(req, res, next) {

    /*if (typeof req.flash !== 'undefined') {
     res.locals.info = req.flash('info');
     res.locals.errors = req.flash('errors');
     res.locals.success = req.flash('success');
     res.locals.warning = req.flash('warning');
     }*/

    function field_error(field) {
        if (typeof res.locals.errors !== "undefined") {
            var errors = res.locals.errors.errors;
            if (errors.hasOwnProperty(field)) {
                return '<span class="help-inline">' + errors[field].message + '</span>';
            }
        }
    }

    function show_errors() {
        if (typeof res.locals.errors !== "undefined") {
            var errors = res.locals.errors;
            return '<div class="alert alert-block alert-error"><strong>' + errors.message + '</strong> ' + errors.name + '</div>';
        }
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

        return [
            '<input',
            ' type="', options.type, '"',
            ' id="', model, '_', field, '"',
            ' name="', model, '[', field, ']"',
            ' placeholder="', options.placeholder, '"',
            ' value="' + value + '"',
            (options.required ? ' required="required"' : ''),
            ' />',
            field_error(field)
        ].join('');
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
        show_errors : show_errors,
        label_for : label_for,
        text_field_for : text_field_for,
        text_area_for : text_area_for
    });

    next();
}

module.exports = formHelpers;