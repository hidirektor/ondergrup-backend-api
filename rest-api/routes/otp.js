const express = require('express');
const router = express.Router();
const sendMailOTP = require('../controllers/otp/sendMail');
const sendSMSOTP = require('../controllers/otp/sendSMS');
const verifyOTP = require('../controllers/otp/verifyOTP');

router.post('/sendMail', sendMailOTP);
router.post('/sendSMS', sendSMSOTP);
router.post('/verifyOTP', verifyOTP);

module.exports = router;