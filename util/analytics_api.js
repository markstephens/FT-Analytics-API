var merge = require('./merge');

// Helper/Util functions specific to Analytics API
var api = (function () {

    function obLength(obj) {
        var length = 0, key;
        for (key in obj ) {
            if (obj.hasOwnProperty(key)) {
                length = length + 1;
            }
        }
        return length;
    }

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

                                if (obLength(tmp_copy) === 1 && tmp_copy.hasOwnProperty('data')) {
                                    tmp_copy = tmp_copy.data;
                                }

                                result[object[index][key]].push(group(tmp_copy));
                            }
                        }
                    }
                }
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

    function groupBy(groups, object, callback) {
        var result = {},
            index,
            group_index,
            pointer,
            key,
            tmp_copy;

        if (!(groups instanceof Array)) {
            groups = [groups];
        }

        if (object instanceof Array) {
            for (index = 0; index < object.length; index++) {
                if (object[index] instanceof Object) {
                    // This pointer only works due to JS storing everything by reference. Eeekk!
                    pointer = result;

                    tmp_copy = merge.object(object[index]);

                    for (group_index = 0; group_index < groups.length; group_index++) {
                        if (tmp_copy.hasOwnProperty(groups[group_index]) || (tmp_copy.hasOwnProperty('data') && tmp_copy.data.hasOwnProperty(groups[group_index]))) {
                            key = (tmp_copy.hasOwnProperty(groups[group_index]) ? tmp_copy[groups[group_index]] : tmp_copy.data[groups[group_index]]);

                            if (!pointer.hasOwnProperty(key)) {
                                if (group_index === (groups.length - 1)) {
                                    pointer[key] = [];
                                } else {
                                    pointer[key] = {};
                                }
                            }

                            if (tmp_copy.hasOwnProperty(groups[group_index])) {
                                delete tmp_copy[groups[group_index]];
                            } else {
                                if (tmp_copy.hasOwnProperty('data') && tmp_copy.data.hasOwnProperty(groups[group_index])) {
                                    delete tmp_copy.data[groups[group_index]];
                                }
                            }

                            pointer =  pointer[key];

                            if (group_index === (groups.length - 1)) {
                                if (obLength(tmp_copy) === 1 && tmp_copy.hasOwnProperty('data')) {
                                    tmp_copy = tmp_copy.data;
                                }
                                pointer.push(tmp_copy);
                            }
                        }
                    }

                }
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
        obLength : obLength,
        build_url : build_url,
        group : group,
        groupBy : groupBy
    };

}());

module.exports = api;