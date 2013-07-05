
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
APISchema.path('title').validate(function (title) {
    return title.length > 0;
}, 'API title cannot be blank');

/**
 * Statics
 */

mongoose.model('API', APISchema);
