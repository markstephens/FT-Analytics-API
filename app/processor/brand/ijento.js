var parseString = require('xml2js').parseString;

var iJentoProcessor = (function () {

    var columns = [];

    function startup_requirements(util) {
        if (process.env.IJENTO_AUTH) {
            util.puts(' - iJento\t\033[32m[ OK ]\033[m');
        } else {
            util.puts(' - iJento: IJENTO_AUTH environment variable missing - you won\'t be able to fetch new data\t\033[32m[ OK ]\033[m');
        }
    }

    function can_get(url) {
        if (/https:\/\/ft\.ijento\.com\/query\/app/.test(url) && process.env.IJENTO_AUTH) {
            return {
                auth: process.env.IJENTO_AUTH,
                port: 443
            };
        } else {
            return false;
        }
    }

    function can_process(data, callback) {
        if (/https:\/\/ft\.ijento\.com\/query\/app/.test(data.url)) {
            parseString(data.data, function (err, result) {
                if (result.hasOwnProperty('results')) {
                    if (result.results.hasOwnProperty('column-data') && result.results.hasOwnProperty('row')) {
                        var last_update, date_str;

                        // Date to parse: Wed Jul 17 07:52:37 BST 2013
                        result.results.$['run-time'].match(/(\w{3}) (\w{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) (\w{3}) (\d{4})/);

                        date_str = RegExp.$3 + ' ' + RegExp.$2 + ' ' + RegExp.$8 + ' ' + RegExp.$4 + ':' + RegExp.$5 + ':' + RegExp.$6;
                        last_update = new Date(Date.parse(date_str));

                        callback({date: last_update, results: result.results});
                    }
                }
            });
        }
    }

    function getRowValue(row, name) {
        var i;

        for (i = 0; i < columns.length; i++) {
            if (columns[i].name === name) {
                return row[columns[i].key][0];
            }
        }
    }

    function do_process(chosen_columns, result, callback) {
        var key, uniq_cols = {}, processed_data = [], results = result.results;

        columns = [];

        for (key in results['column-data'][0]) {
            if (results['column-data'][0].hasOwnProperty(key)) {
                /*chosen_columns.forEach(function (col) {
                 if (col.name === results['column-data'][0][key][0].$.label) {*/
                uniq_cols[key] = {
                    name: results['column-data'][0][key][0].$.label,
                    key: key,
                    canSum: (results.hasOwnProperty('totalrow') ? (results.totalrow[0][key][0] !== '-') : false),
                    values: []
                };
                /*}
                 });*/
            }
        }

        // Turn columns into an array
        for (key in uniq_cols) {
            if (uniq_cols.hasOwnProperty(key)) {
                columns.push(uniq_cols[key]);
            }
        }

        results.row.forEach(function (r) {
            var data = {}, i, value, column,
                datetime = new Date(Date.parse(getRowValue(r, 'Timestamp binned by Date')));
            datetime = new Date(Date.UTC(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()));
            datetime.setUTCHours(parseInt(getRowValue(r, 'Timestamp binned by Hour of day'), 10));

            for (i = 0; i < columns.length; i++) {
                column = columns[i];

                // Get rid of the date columns as we calculate manually
                if (column.name !== 'Timestamp binned by Date' && column.name !== 'Timestamp binned by Hour of day') {
                    // Get the value from the row
                    value = getRowValue(r, column.name);

                    // Save the value in the data value to be returned
                    data[column.name] = value;

                    // Store the value uniquely so it can be used for filtering.
                    if (!column.canSum) {
                        if (column.values.indexOf(value) === -1) {
                            column.values.push(value);
                        }
                    }
                }
            }

            /*if (!processed_data.hasOwnProperty(datetime)) {
             processed_data[datetime] = [];
             }*/

            processed_data.push({ date: datetime, data: data});
        });

        callback({ date: result.date, columns: columns, data: processed_data }); // data should be in the format of { date: Date, data: [{ date: Date, data: {} }] }
    }

    return {
        startup_requirements : startup_requirements,
        can_get : can_get,
        can_process : can_process,
        process : do_process
    };
}());

module.exports = iJentoProcessor;