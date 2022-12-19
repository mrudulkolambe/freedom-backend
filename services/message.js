require('dotenv').config();
var AWS = require('aws-sdk');
AWS.config.update({
    "accessKeyId": "AKIAUX7BYM6ZZALNQ2HD",
    "secretAccessKey": "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",
    "region": "ap-south-1" 
});

async function sendSMSUsingSNS(message, phone) {

    const params = {
        Message: message, /* required */
        PhoneNumber: phone,
    };
    // Create promise and SNS service object
    const publishTextPromise =await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    console.log("publishTextPromise", publishTextPromise)
}
// sendSMSUsingTwilio("Hello World","+917028668351");
exports.sendSMS = async (message,phone) => {
    try{
        //twilio
        //sendSMSUsingTwilio(message,phone);
        //SNS
        sendSMSUsingSNS(message,phone);
        
    }catch (err) {
        return err
    }
}