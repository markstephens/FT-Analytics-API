
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
    _api : {type : Schema.Types.ObjectId, ref : 'API'},
    date : {type : Date},
    data : [{type : Mixed}]
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

mongoose.model('Data', DataSchema);
