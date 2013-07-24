
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    processor = require("../processor/processor"),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    merge = require("../../util/merge");

/**
 * Getters
 */
var getLastDataUpdate = function (date) {
    return typeof date === "undefined" ? (new Date(0)) : date;
};


/**
 * Setters
 */
var setColumns = function (columns) {
    return columns.map(function (column) {
        if (typeof column === "string") {
            return {
                name : column,
                values : [],
                canSum : false
            };
        } else {
            return column;
        }
    });
};


/**
 * API Schema
 */
var APISchema = new Schema({
    // Essential columns
    title: {type : String, 'default' : '', trim : true},
    description: {type : String, 'default' : '', trim : true},
    url: {type : String, 'default' : '', trim : true},

    // Data info
    dataUrl: {type : String, 'default' : '', trim : true},
    columns: {type: [{ type: Mixed }], set: setColumns },
    lastDataUpdate: {type: Date, get: getLastDataUpdate},
    num_records: {type: Number, 'default': 0 },

    // Has many
    data: [{type : Schema.Types.ObjectId, ref : 'Data'}],
    charts: [{type : Schema.Types.ObjectId, ref : 'Chart'}],

    createdAt  : {type : Date, 'default' : Date.now},
    updatedAt  : {type : Date, 'default' : Date.now}
});

/**
 * Validations
 */
APISchema.path('title').required(true);
APISchema.path('dataUrl').required(true).validate(function (url) {
    return (/^(https?:\/\/)?([\da-z\.\-]+)(\.([a-z\.]{2,6}))?(:\d+)?([\/\.\w])+(\?([\/\w \.\-%&=]*))?$/).test(url.trim());
}, 'Data url must be a valid URL.');
APISchema.path('url').required(true);

/**
 * Virtuals
 */

APISchema.virtual('newcolumn')
    .set(function (column) {
        this.columns.push(column);
    })
    .get(function () { return ''; });

/**
 * Before save callback
 */

APISchema.methods = {
    populateData : function () {
        var Data = mongoose.model('Data'),
            api = this;

        processor.process(api, function (data) { // data should be in the format of { date: Date, data: [{ date: Date, data: {} }] }
            //console.log('api.js', 'Found ' + data.data.length + ' records.');

            data.data.forEach(function (d) {
                (new Data(merge.object(d, { _api : api._id }))).save();
            });

            api.columns = data.columns;
            api.lastDataUpdate = data.date;
            api.num_records += data.data.length;
            api.save();

            console.log('api.js', 'DONE!');
        });
    }
};

mongoose.model('API', APISchema);
