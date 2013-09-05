var util = require('util'),
    frequency = process.argv[2],
    mongoose = require('mongoose'),
    API = mongoose.model('API'),
    valid_frequencies = ['minute', '10 minutes', 'hour', '2 hours', '6 hours', '12 hours', 'day'],
    finished_apis = 0;

if (valid_frequencies.indexOf(frequency) === -1) {
    util.error("Invalid frequency used, should be one of: '" + valid_frequencies.join("', '") + "' as the first argument.");
    process.exit(1);
}

API.find({ frequency: frequency }, function (err, apis) {
    if (err) {
        util.error("Error looking up APIs");
        util.error(err);
        process.exit(1);
    } else {
        if (apis.length === 0) {
            //util.puts('No apis found');
            mongoose.disconnect();
            process.exit(0);
        }

        apis.forEach(function (api) {
            util.puts(' - ' + api.title);
            api.populateData(function () {
                finished_apis += 1;

                if (finished_apis === apis.length) {
                    mongoose.disconnect();
                    process.exit(0);
                }
            });
        });
    }
});