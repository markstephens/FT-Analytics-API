"use strict";

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    processor = require("../processor/processor"),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    merge = require("../../util/merge"),
    analytics_api = require("../../util/analytics_api"),
    timings = {
        'minute' : 60,
        '10 minutes' : (60 * 10),
        'hour' : (60 * 60),
        '2 hours' : (60 * 60 * 2),
        '6 hours' : (60 * 60 * 6),
        '12 hours' : (60 * 60 * 12),
        'day' : (60 * 60 * 24)
    };

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
    frequency: {type : String, 'default' : 'day'},

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
    return (/^(https?:\/\/)?([\da-z\.\-]+)(\.([a-z\.]{2,6}))?(:\d+)?([\/\.\w\-])+(\?([\/\w \.\-%&=]*))?$/).test(url.trim());
}, 'Data url must be a valid URL.');

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
    populateData : function (callback) {
        var Data = mongoose.model('Data'),
            api = this;

        processor.process(api, function (data) { // data should be in the format of { date: Date, data: [{ date: Date, data: {} }] }
            if (typeof data !== "undefined") {
                var i;

                for (i = 0; i < data.data.length; i++) {
                    (new Data(merge.object(data.data[i], { _api : api._id }))).save();
                }

                api.columns = data.columns;
                api.lastDataUpdate = data.date;
                api.num_records += data.data.length;
                api.save(function () {
                    console.log(api.title, 'DONE!');

                    if (typeof callback !== "undefined") {
                        callback();
                    }
                });
            } else {
                if (typeof callback !== "undefined") {
                    callback();
                }
            }
        });
    },
    timings : timings,
    next_update : function () {
        var update = (timings[this.frequency] * 1000) - ((new Date()).getTime() - this.lastDataUpdate.getTime());
        return (update < 0 ? 0 : update);
    },
    redo_count_cache : function (callback) {
        var Data = mongoose.model('Data'),
            api = this;

        Data.count({ _api : api._id }, function (err, count) {
            api.num_records = count;
            api.save(callback);
        });

    },
    getData : function (date, options, callback) {
        var Data = mongoose.model('Data'),
            api = this,

            query = {},
            param_key;

        if (analytics_api.obLength(options) > 0) {
            for (param_key in options) {
                if (options.hasOwnProperty(param_key)) {
                    if (options[param_key].trim() !== '') {
                        query['data.' + param_key] = options[param_key];
                    } else {
                        delete options[param_key];
                    }
                }
            }
        }

        console.log(date, query);

        Data.filterByRelativeDate(date).find(merge.object(query, { _api : api._id })).select("-_id -_api -__v").exec(callback);
    }
};

mongoose.model('API', APISchema);
