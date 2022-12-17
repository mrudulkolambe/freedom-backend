const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const messageModel = new Schema({
	name: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true
	},
	sender: {
		type: Schema.Types.ObjectId,
		required: true
	},
	role: {
		type: String,
		required: true
	},
	to: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Customer"
	},
	timeStamp: {
		type: Date,
		required: true,
		default: new Date()
	}
});

const Message = mongoose.model('Message', messageModel);

module.exports = Message;
