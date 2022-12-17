const express = require("express");
const { isValidToken } = require("../middlewares/auth");
const Application = require("../Models/applicationModel");
const router = express.Router();


//ADD APPLICANT
router.post('/', isValidToken, async (req, res) => {
	try {
		const applicants = await Application.find({ customer: req.AuthenticateUser._id })
		res.status(200).json(applicants);
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})


router.post("/add", isValidToken, async (req, res) => {
	try {
		const PrevApplications = await Application.find({ customer: req.AuthenticateUser._id })
		if (PrevApplications.length === 0) {
			const newApplicant = new Application({ ...req.body, customer: req.AuthenticateUser._id })
			const newApplicantFinal = await newApplicant.save()
			res.status(200).json(newApplicantFinal);
		} else {
			res.json({ message: "You have a pending application!" })
		}
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

//UPDATE APPLICANT
router.patch("/:id", isValidToken, async (req, res) => {
	try {
		const updatedApplicant = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true })
		res.status(200).json(updatedApplicant)
	} catch (err) {
		res.json({ message: err.message })
	}
})

//DELETE APPLICANT
router.delete("/:id", isValidToken, async (req, res) => {
	try {
		await Application.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Applicant Deleted' })
	} catch (err) {
		res.json({ message: err.message })
	}
})

module.exports = router;
