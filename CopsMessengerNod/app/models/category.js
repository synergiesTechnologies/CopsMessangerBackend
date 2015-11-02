var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Category', new Schema({ 
	category: String,
	status: String,
}));