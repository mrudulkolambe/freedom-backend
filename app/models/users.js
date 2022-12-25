var mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    country_code: {
      type: String,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    dob: {
      type: Date
    },
    speciality: {
      type: String,
      trim: true
    },
    profile_pic: {
      type: String
    },
    cover_pic: {
      type: String
    },
    qualification: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    fcm_token: {
      type: String,
    },
    app_version: {
      type: String,
    },
    device_info: {
      type: Object,
    },
    otp: {
      type: String
    },
    otp_generated_at: {
      type: Date,
      default: new Date()
    },
    refferal_code: {
      type: String
    },
    is_login: {
      type: Boolean
    },
    last_login_at: {
      type: Date
    },
    created_at: {
      type: Date,
      default: new Date()
    },
    updated_at: {
      type: Date
    },
    personalLoan: {
      type: Object
    },
    carLoan: {
      type: Object
    },
    storeCard: {
      type: Object
    },
    currentAddress: {
      type: Object
    },
    previousAddress: {
      type: Object
    },
    occupation: {
      type: Object
    },
    dependents: {
      type: Object
    },
    outstandings: {
      type: Object
    },
    contactType: {
      type: [String]
    },
  });

module.exports = mongoose.model("Customer", userSchema);