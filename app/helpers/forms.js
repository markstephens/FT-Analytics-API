function formHelpers(req, res, next) {

    if (typeof req.flash !== 'undefined') {
        res.locals.info = req.flash('info');
        res.locals.errors = req.flash('errors');
        res.locals.success = req.flash('success');
        res.locals.warning = req.flash('warning');
    }

    function clone(target, options) {
        if (!options) {
            options = target;
            target = {};
        }

        var name, src, copy;

        for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target === copy) {
                continue;
            }

            // Gets rid of missing values too
            if (typeof copy !== "undefined" && copy !== null) {
                target[name] = copy;
            }
        }

        return target;
    }

    function label_for(model, field, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = clone({
            label : field,
            'class' : 'control-label'
        }, options);

        return '<label for="' + model + '_' + field + '" class="' + options['class'] + '">' + options.label + '</label>';
    }

    function text_field_for(model, field, value, options) {
        if (typeof options === "undefined") {
            options = {};
        }

        options = clone({
            type : 'text',
            placeholder : field,
            required : false,
            'class' : 'control-label'
        }, options);

        return '<input type="' + options.type + '" id="' + model + '_' + field + '" name="' + model + '[' + field + ']" placeholder="' + options.placeholder + '" value="' + value + '" ' + (options.required ? 'required="required"' : '') + ' />';
    }

    res.locals({
        label_for : label_for,
        text_field_for : text_field_for
    });

    next();
}

module.exports = formHelpers;