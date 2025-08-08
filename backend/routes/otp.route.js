const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otp.controller');

const router = express.Router();

router.get('/send', sendOTP);
router.get('/verify', verifyOTP);

module.exports = router;