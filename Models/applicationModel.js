const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const moment = require('moment');


const handleDate = () => {
	const dateObj = new Date();
	return moment(dateObj).format("MMM, DD, YYYY")
}
const applicationSchema = new Schema({
	interestedIn: {
		type: String,
	},
	applicant1: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Customer"
	},
	applicant2: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	},
	property: {
		type: Schema.Types.ObjectId,
		ref: "Property"
	},
	documents: {
		type: Object
	},
	timeStamp: {
		type: String,
		default: handleDate
	},
});


const Application = mongoose.model('application', applicationSchema);

module.exports = Application;
