const express = require("express");
const { isValidToken } = require("../middlewares/auth");
const router = express.Router();
const Message = require('../Models/messageModel')


//GET ALL PROPERTIES OF USER
router.post('/', isValidToken, async (req, res) => {
	try {
		const messages = await Message.find({ to: req.AuthenticateUser._id }).sort({orderTimestamp: -1}) 
		res.status(200).json(messages);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

//ADD MESSAGE
router.post('/add', async (req, res) => {
	const message = new Message(req.body)
	try {
		const newMessage = await message.save()
		res.status(200).json(newMessage);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

//DELETE PROPERTY
router.delete("/:id", async (req, res) => {
	try {
		await Property.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Property Deleted' })
	} catch (err) {
		res.json({ message: err.message })
	}
})

module.exports = router;
