const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const customerModel = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	phonenumber: {
		type: String,
		required: true
	},
	photoURL: {
		type: String,
		requried: true
	},
	personalLoan: {
		type: Object
	},
	carLoan: {
		type: Object
	},
	storeCard: {
		type: Object
	},
	contactType: {
		type: [String]
	}
});

// const Customer = mongoose.model('Customer', customerModel);

// module.exports = Customer;
