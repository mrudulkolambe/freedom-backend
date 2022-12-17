const express = require("express");
const { isValidToken } = require("../middlewares/auth");
const router = express.Router();
const Property = require('../Models/propertyModel')


//GET ALL PROPERTIES OF USER
router.get('/:id', isValidToken, async (req, res) => {
	try {
		const properties = await Property.find({ _id: req.params.id })
		res.status(200).json(properties);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.post("/user", isValidToken, async (req, res) => {
	try {
		const properties = await Property.find({ customerId: req.AuthenticateUser._id });
		res.send(properties)
	} catch (err) {
		res.send({ message: err })
	}
})

router.post('/add', isValidToken, async (req, res) => {
	const property = new Property({ ...req.body, customerId: req.AuthenticateUser._id })
	try {
		const newProperty = await property.save()
		res.status(200).json(newProperty);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

//UPDATE PROPERTY
router.patch("/:id", isValidToken, async (req, res) => {
	try {
		const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true })
		res.status(200).json(updatedProperty)
	} catch (err) {
		res.json({ message: err.message })
	}
})

//DELETE PROPERTY
router.delete("/:id", isValidToken, async (req, res) => {
	try {
		await Property.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Property Deleted' })
	} catch (err) {
		res.json({ message: err.message })
	}
})

module.exports = router;
