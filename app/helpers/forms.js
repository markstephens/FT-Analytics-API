var merge = require('../../util/merge');

function formHelpers(req, res, next) {

    /*if (typeof req.flash !== 'undefined') {
     res.locals.info = req.flash('info');
     res.locals.errors = req.flash('errors');
     res.locals.success = req.flash('success');
     res.locals.warning = req.flash('warning');
     }*/

    function csrf() {
        return '<input type="hidden" name="_csrf" value="' + req.session._csrf + '" />';
    }

    function show_errors() {
        if (typeof res.locals.flash !== "undefined") {
            if (typeof res.locals.flash.error !== "undefined") {
                var errors = res.locals.error;
                return '<div class="alert alert-block alert-error"><strong>' + errors.message + '</strong> ' + errors.name + '</div>';
            }
        }
    }

    function has_error(field) {
        if (typeof res.locals.flash !== "undefined") {
            if (typeof res.locals.flash.error !== "undefined") {
                if (typeof res.locals.flash.error[0] !== "undefined") {
                    if (typeof res.locals.flash.error[0].errors !== "undefined") {
                        return res.locals.flash.error[0].errors.hasOwnProperty(field);
                    }
                }
            }
        }

        return false;
    }

    function field_error(field) {
        if (has_error(field)) {
            return '<span class="help-inline">' + res.locals.flash.error[0].errors[field].message + '</span>';
        }
        return "";
    }

    function field_group_start(field) {
        return '<div class="control-group' + (has_error(field) ? " error" : "") + '">' + field_error(field);
    }

    function field_group_end() {
        return '</div>';
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
            ' />'
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


    function form_field(type, model, field, value, options) {
        var html = [];
        html.push(field_group_start(field));
        html.push(label_for(model, field, options));
        html.push('<div class="controls">');

        switch (type) {
        case 'textarea':
            html.push(text_area_for(model, field, value, options));
            break;
        default:
            html.push(text_field_for(model, field, value, options));
        }



        if (options.help) {
            html.push('<span class="help-block">' + options.help + '</span>');
        }

        html.push('</div>');
        html.push(field_group_end());

        return html.join('');
    }

    function selected(name, value) {
        if (typeof req.query !== "undefined") {
            if (typeof req.query[name] !== "undefined") {
                if (req.query[name] === value) {
                    return ' selected="selected"';
                }
            }
        }

        return '';
    }

    res.locals({
        csrf : csrf,
        show_errors : show_errors,
        field_group_start: field_group_start,
        field_group_end: field_group_end,
        label_for : label_for,
        text_field_for : text_field_for,
        text_area_for : text_area_for,
        form_field : form_field,
        selected : selected
    });

    next();
}

module.exports = formHelpers;