"use strict";

var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    merge = require("./merge"),
    request = require('request');

var curl = (function () {

    var default_options = {};

    function data(uri, options, callback) {
        var opts = merge.object(default_options, options);

        if ((/^https/.test(uri) && config.https_proxy) || (/^http:/.test(uri) && config.http_proxy)) {
            opts.proxy = 'http://' + (/^https/.test(uri) ? config.https_proxy.host : config.http_proxy.host) + ':' + (/^https/.test(uri) ? config.https_proxy.port : config.http_proxy.port);
        }

        if (opts.auth) {
            opts.auth.sendImmediately = false;
        }

        console.log('CURL opts', opts);

        request(uri, opts, callback);
    }

    return {
        //head : head,
        data : data
    };
}());



module.exports = curl;