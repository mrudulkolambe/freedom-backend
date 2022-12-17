const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const PropertySchema = new Schema({
	customerId: {
		type: Schema.Types.ObjectId,
		ref: "Customer",
	},
	propertyType: {
		type: String,
		required: true
	},
	propertyDetails: {
		type: Object,
	},
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
