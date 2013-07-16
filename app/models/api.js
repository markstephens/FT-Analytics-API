
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    processor = require("../processor/processor"),
    Schema = mongoose.Schema,
    merge = require("../../util/merge");

/**
 * API Schema
 */
var APISchema = new Schema({
    title: {type : String, 'default' : '', trim : true},
    dataUrl: {type : String, 'default' : '', trim : true},
    description: {type : String, 'default' : '', trim : true},
    url: {type : String, 'default' : '', trim : true},
    columns: {type: []},
    data: [{type : Schema.Types.ObjectId, ref : 'Data'}],
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
    populateData : function () {
        var Data = mongoose.model('Data'),
            api = this;

        processor.process(api, function (data) { // data should be in the format of [{ date: Date, data: {} }]
            console.log('api.js', 'Found ' + data.length + ' records.');

            data.forEach(function (d) {
                (new Data(merge.object(d, { _api : api._id }))).save();
            });

            console.log('api.js', 'DONE!');
        });
    }
};

mongoose.model('API', APISchema);
