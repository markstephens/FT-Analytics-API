
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = mongoose.Schema.Types.Mixed;

/**
 * Data Schema
 */
var DataSchema = new Schema({
    _api : {type : Schema.Types.ObjectId, ref : 'API'},
    date : {type : Date},
    data : {type : Mixed}
});

mongoose.model('Data', DataSchema);
