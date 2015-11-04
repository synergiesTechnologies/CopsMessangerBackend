var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	name: String, 
	password: String, 
	admin: Boolean ,
	category: String,
	address: String,
	emailaddress: String,
	mobile: Number,
	district: String,
	city: String,
	status: String
}));