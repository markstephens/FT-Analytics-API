
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
    url: {type : String, 'default' : '', trim : true},
    description: {type : String, 'default' : '', trim : true},

    columns: [{
        name: { type : String, 'default' : '', trim : true }
    }],

    createdAt  : {type : Date, 'default' : Date.now},
    updatedAt  : {type : Date, 'default' : Date.now}
});

/**
 * Validations
 */
APISchema.path('title').required(true);
APISchema.path('url').required(true).validate(function (url) {
    return /^(http?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/.test(url);
}, 'API url must be a valid URL.');

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
APISchema.pre('save', function (next) {
    console.log('Before save', this.columns);

    next();
});

mongoose.model('API', APISchema);
