const express = require("express");
const router = express.Router();
const Customer = require('../Models/customerModel')
const bcrypt = require("bcrypt")


//ADD USER
router.get('/:id', async (req, res) => {
	try {
		const customer = await Customer.find({_id: req.params.id})
		res.status(200).json(customer);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.get('/all/customers', async (req, res) => {
	try {
		const customers = await Customer.find()
		res.status(200).json(customers);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.post('/create', async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const finalUserObj = req.body;
	finalUserObj.password = hashedPassword
	const customer = new Customer(finalUserObj)
	try {
		const newUser = await customer.save()
		res.status(200).json(newUser);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.post('/add', async (req, res) => {
	const user = new Customer(req.body)
	try {
		const newUser = await user.save()
		res.status(200).json(newUser);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

//UPDATE USER
router.patch("/:id", async (req, res) => {
	try {
		const updatedUser = await Customer.findByIdAndpUdate(req.params.id, req.body, { new: true })
		res.status(200).json(updatedUser)
	} catch (err) {
		res.json({ message: err.message })
	}
})

//DELETE USER
router.delete("/:id", async (req, res) => {
	try {
		await Customer.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'User Deleted' })
	} catch (err) {
		res.json({ message: err.message })
	}
})

module.exports = router;