var merge = require('./merge');

// Helper/Util functions specific to Analytics API
var api = (function () {

    // Build an API or Chart "service" URL.
    function build_url(type, api, req) {
        var url = 'http://' + req.headers.host + '/' + type + '/' + api._id,
            qs = [],
            key;

        for (key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                if (req.query[key].trim() !== '') {
                    qs.push(key + '=' + req.query[key]);
                }
            }
        }

        if (qs.length > 0) {
            url = url + '?' + qs.join('&');
        }

        return url;
    }

    // Group an object into it's key fields.
    // -- But don't sum anything!
    function group(object, callback) {
        var result = {},
            index,
            key,
            tmp_copy;

        if (object instanceof Array) {
            for (index = 0; index < object.length; index++) {
                if (object[index] instanceof Object) {
                    for (key in object[index]) {
                        if (object[index].hasOwnProperty(key)) {
                            if (!(object[index][key] instanceof Object)) {
                                if (!result.hasOwnProperty(object[index][key])) {
                                    result[object[index][key]] = [];
                                }

                                tmp_copy = merge.object(object[index]);
                                delete tmp_copy[key];

                                result[object[index][key]].push(group(tmp_copy));
                            }
                        }
                    }
                } /*else {
                 result.push(object[index]);
                 }*/
            }
        } else {
            return object;
        }

        if (typeof callback === "function") {
            callback(result);
        } else {
            return result;
        }
    }

    return {
        build_url : build_url,
        group : group
    };

}());

module.exports = api;