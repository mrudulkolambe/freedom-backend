const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const ContactModel = new Schema({
	name: {
		type: String,
		required: true
	},
	customer: {
		type: Schema.Types.ObjectId,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	contactNo: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	}
});

const Contact = mongoose.model('Contact', ContactModel);

module.exports = Contact;
