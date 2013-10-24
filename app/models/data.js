"use strict";

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed;

/**
 * Data Schema
 */
var DataSchema = new Schema({
    _api : {type : Schema.Types.ObjectId, ref : 'API', index: true},
    date : {type : Date, index: true},
    data : {type : Mixed}
});

/**
 * Finders
 */
DataSchema.statics.filterByRelativeDate = function (date) {
    if (typeof date === "string") {
        date = Math.abs(parseFloat(date)); // Float to cope with half days
    }

    if (!date) {
        date = 1;
    }

    var today = new Date();
    today.setHours(0);

    return this.where('date', {
        '$gte' : (new Date(today.getTime() - (1000 * 60 * 60 * 24 * date)))
    });
};

DataSchema.statics.clearDataOlderThan = function (date, callback) {
    if (typeof callback === "undefined") {
        callback = function () {};
    }

    if (typeof date === "string") {
        date = Math.abs(parseInt(date, 10));
    }

    if (!date) {
        date = 60; // 2 months-ish
    }

    var today = new Date();
    today.setHours(0);

    this.remove({ 'date': { '$lt' : (new Date(today.getTime() - (1000 * 60 * 60 * 24 * date))) } }, function (err, res) {
        if (err) {
            console.error(err);
        }

        callback(res);
    });
};

mongoose.model('Data', DataSchema);
