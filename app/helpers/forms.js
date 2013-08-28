var merge = require('../../util/merge');

function formHelpers(req, res, next) {

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

    function field_group_start(field, checkbox) {
        return '<div class="' + (checkbox ? 'checkbox' : 'form-group') + (has_error(field) ? " has-error" : "") + '">' + field_error(field);
    }

    function field_group_end() {
        return '</div>';
    }

    function label_for(model, field, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            id: model + '_' + field,
            label : field,
            'class' : 'col-lg-2 control-label'
        }, options);

        return '<label for="' + options.id + '" class="' + options['class'] + '">' + options.label + '</label>';
    }

    function text_field_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            id: model + '_' + field,
            name: model + '[' + field + ']',
            type : 'text',
            placeholder : field,
            'class' : 'form-control',
            required : false
        }, options);

        return [
            '<input',
            ' type="', options.type, '"',
            ' id="', options.id, '"',
            ' name="', options.name, '"',
            ' placeholder="', options.placeholder, '"',
            ' value="' + value + '"',
            (options.required ? ' required="required"' : ''),
            ' class="' + options['class'] + '"',
            ' />'
        ].join('');
    }

    function checkbox_or_radio_for(model, type, field, value, checked_value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            id: model + '_' + field,
            name: model + '[' + field + ']',
            'class' : (options.inline ? '' : 'form-control'),
        }, options);

        return [
            '<input',
            ' type="', type, '"',
            ' id="', options.id, '"',
            ' name="', options.name, '"',
            ' value="' + value + '"',
            (value === checked_value ? ' checked="checked"' : ''),
            ' class="' + options['class'] + '"',
            ' />'
        ].join('');
    }

    function checkbox_for(model, field, value, checked_value, options) {
        return checkbox_or_radio_for(model, 'checkbox', field, value, checked_value, options);
    }

    function radio_for(model, field, value, checked_value, options) {
        return checkbox_or_radio_for(model, 'radio', field, value, checked_value, options);
    }

    function text_area_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            id: model + '_' + field,
            name: model + '[' + field + ']',
            placeholder : field,
            required : false,
            'class' : 'form-control',
            rows : 3
        }, options);

        return '<textarea id="' + options.id + '" name="' + options.name + '" placeholder="' + options.placeholder + '" rows="' + options.rows + '" class="' + options['class'] + '"' + (options.required ? ' required="required"' : '') + '>' + value + '</textarea>';
    }

    function select_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = merge.object({
            id: model + '_' + field,
            name: model + '[' + field + ']',
            required : false,
            multiple : false,
            'class' : 'form-control',
            values : []
        }, options);

        var html = [];

        html.push('<select id="' + options.id + '" name="' + options.name + '" class="' + options['class'] + '"' + (options.required ? ' required="required"' : '') + '' + (options.multiple ? ' multiple="multiple"' : '') + '>');

        if (options.blank) {
            html.push('<option value="">' + options.blank + '</option>');
        }

        options.values.forEach(function (val) {
            var selected = '';

            if (typeof value !== "undefined") {
                if (options.multiple) {
                    if (value.indexOf(val) > -1) {
                        selected = ' selected="selected"';
                    }
                } else {
                    if (val === value) {
                        selected = ' selected="selected"';
                    }
                }
            }

            html.push('<option value="' + val + '"' + selected + '>' + val + '</option>');
        });

        html.push('</select>');

        return html;
    }

    function form_field(type, model, field, value, options) {
        var html = [];

        html.push(field_group_start(field, ((type === 'radio' || type === 'checkbox') && options.inline)));

        if ((type === 'radio' || type === 'checkbox') && options.inline) {
            html.push('<div class="col-lg-offset-2">');

            switch (type) {
                case 'radio':
                    html.push(radio_for(model, field, value, options.checked_value, options));
                    break;
                case 'checkbox':
                    html.push(checkbox_for(model, field, value, options.checked_value, options));
                    break;
            }

            html.push(label_for(model, field, merge.object({ 'class' : '' }, options)));

            if (options.help) {
                html.push('<span class="help-block">' + options.help + '</span>');
            }

            html.push('</div>');
        } else {
            html.push(label_for(model, field, options));
            html.push('<div class="col-lg-8">');

            switch (type) {
                case 'textarea':
                    html.push(text_area_for(model, field, value, options));
                    break;
                case 'select':
                    html.push(select_for(model, field, value, options));
                    break;
                case 'radio':
                    html.push(radio_for(model, field, value, options.checked_value, options));
                    break;
                case 'checkbox':
                    html.push(checkbox_for(model, field, value, options.checked_value, options));
                    break;
                default:
                    html.push(text_field_for(model, field, value, options));
            }

            if (options.help) {
                html.push('<span class="help-block">' + options.help + '</span>');
            }

            html.push('</div>');
        }

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
        select_for : select_for,
        checkbox_for : checkbox_for,
        radio_for : radio_for,
        form_field : form_field,
        selected : selected
    });

    next();
}

module.exports = formHelpers;