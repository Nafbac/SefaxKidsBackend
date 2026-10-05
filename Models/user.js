const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = mongoose.Schema({
  last_name: {
    type: String,
  },
  first_name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  otp: {
    type: Number,
  },
  role: {
    type: Number,
    default: 1, // 1 for simple user, 2 for doctor
  },
  otpExpire: {
    type: Date,
  }
}, { timestamps: true });


module.exports.User = mongoose.model("user", userSchema);