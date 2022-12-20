const express = require("express");
const { isValidToken } = require("../middlewares/auth");
const Contact = require("../Models/contactModel");
const router = express.Router();


router.post('/', isValidToken, async (req, res) => {
	try {
		const contacts = await Contact.find({ customer: req.AuthenticateUser._id })
		res.status(200).json(contacts);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.post("/add", isValidToken, async (req, res) => {
	try {
		const contactInfo = new Contact({ ...req.body, customer: req.AuthenticateUser._id })
		const finalContact = await contactInfo.save()
		res.status(200).json(finalContact);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

module.exports = router;
