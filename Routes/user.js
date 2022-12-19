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
				const accessToken = jwt.sign({ email: user.email, role: user.role }, "a673010911bef1394a8d0496eb7a5c5ae6400eb8033ae4b7f8616a06bf11b6c1fad3cb5809db9b8b80b998cc490053c70a1cf36d706ebe96f845b0988e185ffd")
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