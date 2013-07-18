
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Data Schema
 */
var ChartSchema = new Schema({
    _api : {type : Schema.Types.ObjectId, ref : 'API'},
    title: {type : String, 'default' : '', trim : true},

    createdAt  : {type : Date, 'default' : Date.now},
    updatedAt  : {type : Date, 'default' : Date.now}
});

mongoose.model('Chart', ChartSchema);
