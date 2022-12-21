const express = require("express");
const { isValidToken } = require("../middlewares/auth");
const Application = require("../Models/applicationModel");
const Case = require("../Models/caseModel");
const router = express.Router();


router.post('/', isValidToken, async (req, res) => {
	try {
		const applicants = await Case.find({ customer: req.AuthenticateUser._id })
		res.status(200).json(applicants);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.post("/add", isValidToken, async (req, res) => {
	try {
		const application = await Application.findOne({ applicant1: req.AuthenticateUser._id })
		if (application) {
			const newCase = new Case({ applicant1: req.AuthenticateUser._id, property: application?.property, documents: application?.documents, interestedIn: application?.interestedIn, caseId: Math.ceil(Math.random() * 100000000) })
			const finalCase = await newCase.save()
			await Application.findByIdAndDelete(application._id)
				.then(() => {
					console.log("deleted")
				})
			res.status(200).json(finalCase);
		} else {
			res.status(404).json({ message: "Application Not Found!" })
		}
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

router.patch("/:id", isValidToken, async (req, res) => {
	try {
		let check = await Case.findById(req.params.id);
		if (check && check.status === "New Lead" || check.status === "Awaiting") {
			const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true })
			res.status(200).json(updatedCase)
		} else {
			res.json({ message: "Not allowed to update" })
		}

	} catch (err) {
		res.json({ message: err.message })
	}
})

router.delete("/:id", isValidToken, async (req, res) => {
	try {
		await Case.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Case Deleted' })
	} catch (err) {
		res.json({ message: err.message })
	}
})

module.exports = router;
