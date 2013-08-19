var merge = require("./merge"),
    url = require('url'),
    http = require('http'),
    https = require('https');

var curl = (function () {

    var default_options = {
        method: "GET",
        port: 443
    };

    function data(uri, options, callback) {
        var opts = merge.object(merge.object(default_options, url.parse(uri)), options),
            method = (/^https/.test(uri) ? https : http),
            theResponse = "",

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