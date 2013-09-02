var jsdom = require("jsdom"),
    fs = require("fs"),
    path = require('path'),
    util = require('util'),
    jquery = fs.readFileSync(path.normalize(__dirname + "../../../../public/js/vendor/jquery-1.10.1.min.js"), "utf-8");

var FTHomepagesProcessor = (function () {

    function startup_requirements(util) {
        util.puts(' - FT Homepages\t\033[32m[ OK ]\033[m');
    }

    function can_get(url) {
        if (/http:\/\/www\.ft\.com\/home\/uk/.test(url)) {
            console.log('FT HomePages - can get');

            return {
                headers : {
                    'User-Agent' : "googlebot"
                }
            };
        } else {
            return false;
        }
    }

    function can_process(data, callback) {
        if (/http:\/\/www\.ft\.com\/home\/uk/.test(data.url)) {
            console.log('FT HomePages - can process');

            jsdom.env({
                html: data.data,
                src: [jquery],
                done: function (errors, window) {
                    console.log('FT HomePages - jsdom done');
                    var last_update = new Date((new Date()).getTime() + (1000 * 60 * 10)); // Set 10 minutes to stop updating every minute
                    callback({date: last_update, results: window });
                }
            });
        }
    }


    function getElementInfo($, element) {
        var zone = element.closest('[data-track-zone], [data-zone]'),
            container = element.closest('[data-track-comp-view], [data-track-comp-name], [data-comp-view], [data-comp-name]'),
            pos = element.closest('[data-track-pos], [data-pos]'),
            name = element.attr('href') || '',
            story = element.closest('.contentPackage, [data-track-region]'); // Data track region would allow us to specify something other than "story" in the future.

        // Build in error coping, as above assumes all attributes are there and available.
        zone = (zone.length > 0 ? (zone.data('track-zone') || zone.data('zone')) : null);
        container = (container.length > 0 ? (container.data('track-comp-view') || container.data('track-comp-name') || container.data('comp-view') || container.data('comp-name')) : null);
        pos = (pos.length > 0 ? (typeof pos.data('track-pos') !== "undefined" ? pos.data('track-pos') : pos.data('pos')).toString() : null);
        name = name.replace(/^http:\/\/[\w\.]+/, '') // Remove http://[something].
            .replace(/^\//, '') // Remove slash at beginning
            .replace(/(\?|#).*$/, '') // Remove query string and page anchor (#)
            .replace(/\/$/, '') // Remove trailing slash
            .replace(/\.[a-z]{3,4}$/, ''); // Remove final ".com" or similar
        story = !!story.length;

        // If it's an external URL
        if (name === '') {
            name = element.attr('href').replace(/^http:\/\//, '').split('?')[0].replace(/\/$/, '');
        }

        // If it broke completely...
        if (name.length === 0) {
            return { zone: '', container: '', pos: '', name: '', storyPackage: '' };
        }

        // Last 2 items of URL
        name = $.grep(name.split('/').slice(-2), function (obj) { return (obj); });

        // If uuid then take final value only
        if (name.slice(-1)[0].match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)) {
            name = name.slice(-1);
        } else {
            return false;
        }

        // Remove slashes as final outcome is slash delimited
        name = (name.length > 1 ? name.slice(0, 2).join('-') : name[0]).toLowerCase();

        return {
            pos : $.grep([
                zone,
                container,
                pos,
                name,
                (story ? 'storyPackage' : null)
            ], function (obj) { return (obj); }).join('/'),
            uuid : name
        };
    }


    function do_process(chosen_columns, result, callback) {
        var date = (new Date()), processed_data = [], unique = {}, data = [], window = result.results, $ = window.$,
        // Manually set columns
            columns = [
                {
                    name: 'Region',
                    key: 'region',
                    canSum: false,
                    values: ['Asia', 'Europe', 'India', 'Middle East', 'UK', 'US']
                },
                {
                    name: 'Positions',
                    key: 'positions',
                    canSum: false,
                    values: []
                }
            ],
            positions = $('#skyline [data-pos] a, #skyline [data-track-pos] a, .editorialSection [data-pos] a, .editorialSection [data-track-pos] a'),
            i,
            elem,
            u;

        for (i = 0; i < positions.length; i++) {
            elem = getElementInfo($, $(positions[i]));
            if (elem) {
                unique[elem.pos] = elem;
            }
        }

        for (u in unique) {
            if (unique.hasOwnProperty(u)) {
                data.push(unique[u]);
            }
        }

        processed_data.push({
            date : date,
            data : {
                region : 'UK',
                positions : data
            }
        });

        // TODO add the other homepages here

        callback({ date: result.date, columns: columns, data: processed_data }); // data should be in the format of { date: Date, data: [{ date: Date, data: {} }] }
    }

    return {
        startup_requirements : startup_requirements,
        can_get : can_get,
        can_process : can_process,
        process : do_process
    };
}());

module.exports = FTHomepagesProcessor;