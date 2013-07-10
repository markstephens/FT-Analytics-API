
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * API Schema
 */
var APISchema = new Schema({
    title: {type : String, 'default' : '', trim : true},
    dataUrl: {type : String, 'default' : '', trim : true},
    description: {type : String, 'default' : '', trim : true},
    url: {type : String, 'default' : '', trim : true},
    columns: {type: []},
    createdAt  : {type : Date, 'default' : Date.now},
    updatedAt  : {type : Date, 'default' : Date.now}
});

/**
 * Validations
 */
APISchema.path('title').required(true);
APISchema.path('dataUrl').required(true).validate(function (url) {
    return (/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w])+(\?([\/\w \.\-%&=]*))?$/).test(url.trim());
}, 'API url must be a valid URL.');
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
/*APISchema.pre('save', function (next) {
    console.log('Before save', this.columns);

    next();
});*/

APISchema.methods = {
    getData : function () {
        // TODO get data - use from app, cron, everywhere!
        // Pass to data processors in util
    }
};

mongoose.model('API', APISchema);
