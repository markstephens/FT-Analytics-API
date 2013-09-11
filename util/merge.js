"use strict";

function Object(target, options) {
    if (!options) {
        options = target;
        target = {};
    }

    var name, src, copy;

    /*jshint forin:false */
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

module.exports.object = Object;