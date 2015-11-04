var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Messeges', new Schema({ 
	messageId: Number, 
    subject: String, 
	sender: String,
	category: String,
	status: String,
	dateStart: { type: Date, default: Date.now }

}));