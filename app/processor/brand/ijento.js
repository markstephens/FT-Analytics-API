var parseString = require('xml2js').parseString;

var iJentoProcessor = (function () {

    var available_cols = {};

    function can_process(data, callback) {
        console.log('ijento.js', 'Can I process this?');

        parseString(data, function (err, result) {
            if (result.hasOwnProperty('results')) {
                console.log('ijento.js', result.results['column-data']);

                if (result.results.hasOwnProperty('column-data') && result.results.hasOwnProperty('row')) {
                    callback(result.results);
                }
            }
        });
    }

    function getRowValue(row, key) {
        return row[available_cols[key]];
    }

    function process(columns, result, callback) {
        console.log('ijento.js', 'processing');

        var key, processed_data = [];

        for (key in result['column-data']) {
            if (result['column-data'].hasOwnProperty(key)) {
                available_cols[result['column-data'][key]] = key;
            }
        }

        columns = columns.filter(function (item) {
            if (item !== 'Timestamp binned by Date' && item !== 'Timestamp binned by Hour of day') {
                return item;
            }
        });

        result.row.forEach(function (r) {
            var data = {},
                datetime = new Date(Date.parse(getRowValue(r, 'Timestamp binned by Date')));
            datetime.setUTCHours(parseInt(getRowValue(r, 'Timestamp binned by Hour of day'), 10));

            columns.forEach(function (column) {
                data[column] = getRowValue(r, column);
            });

            processed_data.push({ date: datetime, data: data });
        });

        callback(processed_data); // data should be in the format of [{ date: Date, data: {} }]
    }

    return {
        can_process : can_process,
        process : process
    };
}());

module.exports = iJentoProcessor;