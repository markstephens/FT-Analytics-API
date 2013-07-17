var parseString = require('xml2js').parseString;

var iJentoProcessor = (function () {

    var available_cols = {};

    function can_process(data, callback) {
        console.log('ijento.js', 'Can I process this?');

        parseString(data, function (err, result) {
            if (result.hasOwnProperty('results')) {
                console.log('ijento.js', result.results['column-data']);

                if (result.results.hasOwnProperty('column-data') && result.results.hasOwnProperty('row')) {
                    var last_update, date_str;

                    // Wed Jul 17 07:52:37 BST 2013
                    result.$['run-time'].match(/(\w{3}) (\w{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) (\w{3}) (\d{4})/);

                    date_str = RegExp.$3 + ' ' + RegExp.$2 + ' ' + RegExp.$8 + ' ' + RegExp.$4 + ':' + RegExp.$5 + ':' + RegExp.$6;
                    last_update = new Date(Date.parse(date_str));

                    console.log(result.$['run-time'], date_str, last_update);

                    callback({date: last_update, results: result.results});
                }
            }
        });
    }

    function getRowValue(row, key) {
        return row[available_cols[key]];
    }

    function process(columns, result, callback) {
        console.log('ijento.js', 'processing');

        var key, processed_data = [], results = result.results;

        for (key in results['column-data']) {
            if (results['column-data'].hasOwnProperty(key)) {
                available_cols[results['column-data'][key]] = key;
            }
        }

        columns = columns.filter(function (item) {
            if (item !== 'Timestamp binned by Date' && item !== 'Timestamp binned by Hour of day') {
                return item;
            }
        });

        results.row.forEach(function (r) {
            var data = {},
                datetime = new Date(Date.parse(getRowValue(r, 'Timestamp binned by Date')));
            datetime.setUTCHours(parseInt(getRowValue(r, 'Timestamp binned by Hour of day'), 10));

            columns.forEach(function (column) {
                data[column] = getRowValue(r, column);
            });

            processed_data.push({ date: datetime, data: data });
        });

        callback({ date: result.date, data: processed_data }); // data should be in the format of { date: Date, data: [{ date: Date, data: {} }] }
    }

    return {
        can_process : can_process,
        process : process
    };
}());

module.exports = iJentoProcessor;