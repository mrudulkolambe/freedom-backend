const express = require("express");
const router = express.Router();
const userSchema = require("../../models/users");
const jwt = require('jsonwebtoken');
const { sendSMS } = require("../../../services/message");
const s3 = require("../../../services/s3");
const logger = require("../../../config/logger");
const multer = require('multer');
const { isValidToken } = require("../../../middlewares/auth");
const upload = multer();

/* refferal code. */
function generate_refferal() {
    try {
        return Math.random().toString(20).substr(2, 6);
    } catch (err) {
        return err
    }
}

//generate 4 digit otp
function generate_otp() {
    try {
        return Math.floor(1000 + Math.random() * 9000);
    } catch (err) {
        return err
    }
}


router.post("/login", async (req, res) => {
    try {
        let otp = generate_otp();
        let check = await userSchema.findOne({ phone_number: req.body.phone_number });
        if (check) {
            await userSchema.updateOne({ phone_number: req.body.phone_number }, { $set: { otp: otp, otp_generated_at: new Date() } });
            sendSMS("Your freedom otp is " + otp, req.body.country_code + "" + req.body.phone_number);
            res.status(200).json({ message: "Otp sent successfully", status: true, otp: otp });
        }
        else {
            userSchema({
                country_code: req.body.country_code,
                phone_number: req.body.phone_number,
                is_login: false,
                otp: otp,
                otp_generated_at: new Date(),
                created_at: new Date()
            }).save(function (err, speciality) {
                if (err) {
                    res.status(400).json({
                        status: false,
                        message: err.message,
                    });
                } else {
                    sendSMS("Your freedom otp is " + otp, req.body.country_code + "" + req.body.phone_number);
                    res.status(200).json({
                        status: true,
                        message: "Otp sent successfully",
                        otp: otp
                    });
                }
            });
        }
    } catch (err) {
        logger.logEvents("Error", err.stack);
        res.status(500).json({
            status: false,
            message: "something went wrong",
        });
    }
});

/* resend otp. */
router.post("/resend_otp", async (req, res) => {
    try {
        let otp = generate_otp();
        let check = await userSchema.findOne({ phone_number: req.body.phone_number });
        if (check) {
            await userSchema.updateOne({ phone_number: req.body.phone_number }, { otp: otp, otp_generated_at: new Date() });
            sendSMS("Your freedom otp is " + otp, req.body.country_code + "" + req.body.phone_number);
            res.status(200).json({ message: "Otp sent successfully", status: true, otp: otp });
        }
        else {
            res.status(400).json({
                status: false,
                message: "User not found",
            });
        }
    } catch (err) {
        logger.logEvents("Error", err.stack);
        res.status(500).json({
            status: false,
            message: "something went wrong",
        });
    }
});

router.patch('/update', isValidToken, async (req, res) => {
    console.log(req.AuthenticateUser._id)
    try {
        const user = await userSchema.findOneAndUpdate({ _id: req.AuthenticateUser._id }, req.body, {
            returnOriginal: false
        })
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})

//verify otp
router.post("/verify_otp", async (req, res) => {
    try {
        let check = await userSchema.findOne({ phone_number: req.body.phone_number, otp: req.body.otp });
        if (check) {
            //check otp expiry
            let otp_generated_at = new Date(check.otp_generated_at);
            let current_time = new Date();
            let diff = Math.abs(current_time - otp_generated_at);
            let minutes = Math.floor((diff / 1000) / 60);
            if (minutes > 1) {
                res.status(200).json({ message: "Otp expired", status: false });
            }
            else {
                await userSchema.updateOne({ phone_number: req.body.phone_number }, { is_login: true, last_login_at: new Date(), updated_at: new Date() });
                let token = jwt.sign({ _id: check._id }, "8R9TBUCVEXFYG2J3K4N6P7Q9SA", { expiresIn: "1d" });
                let refresh_token = jwt.sign({ _id: check._id }, "TBUCWEXFYG2J3K4N6P7Q9SATBV");
                res.status(200).json({ message: "User verified successfully", status: true, data: check, access_token: token, refresh_token: refresh_token });
            }
        }
        else {
            res.status(200).json({ message: "Invalid otp", status: false });
        }
    } catch (err) {
        logger.logEvents("Error", err.stack);
        res.status(500).json({
            status: false,
            message: "something went wrong",
        });
    }
});

/* upload document */
router.patch("/upload_document", upload.single('file'), async function (req, res) {
    try {
        console.log(req.file);
        //upload image to s3
        let file_path = Date.now() + req.file.originalname;
        let get = await s3.fileUploadViaMultipart(file_path, req.file.buffer, req.file.mimetype);
        res.status(200).json({ message: "Document uploaded successfully", status: true, file_path: "https://freedom-documents.s3.eu-west-2.amazonaws.com/" + file_path });
    }
    catch (err) {
        logger.logEvents("Error", err.stack);
        res.status(500).json({
            status: false,
            message: "something went wrong",
        });
    }
});


module.exports = router;
