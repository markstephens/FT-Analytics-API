"use strict";

var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env],
    merge = require("./merge"),
    url = require('url'),
    http = require('http'),
    https = require('https');

var curl = (function () {

    var default_options = {
        method: "GET",
        port: 80
    };

    function data(uri, options, callback) {
        var opts = merge.object(merge.object(merge.object(default_options, url.parse(uri)), {
                port : (/^https/.test(uri) ? 443 : 80)
            }), options),
            method = (/^https/.test(uri) ? https : http),
            theResponse = "",
            req;

        if ((/^https/.test(uri) && config.https_proxy) || (/^http:/.test(uri) && config.http_proxy)) {
            opts = {
                host: (/^https/.test(uri) ? config.https_proxy.host : config.http_proxy.host),
                port: (/^https/.test(uri) ? config.https_proxy.port : config.http_proxy.port),
                path: uri,
                headers: merge.object({
                    Host: url.parse(uri).hostname
                }, options.headers)
            };

            if (options.auth) {
                opts.headers.Authorization = 'Basic ' + new Buffer(options.auth).toString('base64');
            }
        }

        //console.log('CURL opts', opts);

        req = method.request(opts, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                theResponse += chunk;
            });

            res.on('end', function () {
                callback(res, theResponse);
            });
        });

        req.on('error', function (e) {
            console.log(e);
            callback(e);
        });

        req.end();
    }

    return {
        //head : head,
        data : data
    };
}());



module.exports = curl;