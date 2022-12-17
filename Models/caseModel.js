const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const moment = require('moment');


const handleDate = () => {
	const dateObj = new Date();
	return moment(dateObj).format("MMM, DD, YYYY")
}

const caseSchema = new Schema({
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
	status: {
		type: String,
		default: "New Lead"
	},
	relationshipManager: {
		type: Schema.Types.ObjectId,
		ref: "Users"
	},
	caseId: {
		type: String,
		unique: true,
		trim: true
	}
});


const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
