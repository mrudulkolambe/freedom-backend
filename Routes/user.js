const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../Models/usersModel')
const bcrypt = require('bcrypt');


// router.post('/create', async (req, res) => {
// 	const hashedPassword = await bcrypt.hash(req.body.password, 10);
// 	const finalUserObj = req.body;
// 	finalUserObj.password = hashedPassword
// 	const user = new User(finalUserObj)
// 	try {
// 		const newUser = await user.save()
// 		res.status(200).json(newUser);
// 	} catch (err) {
// 		res.status(400).json({ message: err.message })
// 	}
// })

router.post('/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		return res.status(404).send("Cannot find user!");
	} else {
		try {
			if (await bcrypt.compare(req.body.password, user.password)) {
				const accessToken = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET)
				res.send({ accessToken, user })
			} else {
				res.send("Not allowed")
			}
		} catch (error) {
			res.send(error)
		}
	}
})

router.patch('/update', async (req, res) => {
	try {
		const user = await User.findOneAndUpdate({ email: req.body.email }, req.body, {
			returnOriginal: false
		})
		res.send(user)
	} catch (error) {
		res.send(error)
	}
})

router.patch('/reset-password', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = await User.findOneAndUpdate({ email: req.body.email }, { password: hashedPassword }, {
			returnOriginal: false
		})
		res.send(user)
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

module.exports = router;