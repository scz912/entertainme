const express = require("express");
const transporter = require("../mailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FORGOT PASSWORD - SEND OTP
router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP into database
    user.resetOTP = otp;

    // OTP expires in 5 minutes
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Send email
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "EntertainMe Password Reset OTP",

      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`

    });

    res.json({
      message: "OTP sent successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// VERIFY OTP
router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check OTP
    if (user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Check OTP expiry
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    res.json({
      message: "OTP verified successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


// RESET PASSWORD
router.post("/reset-password", async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    user.password = hashedPassword;

    // Remove OTP after successful reset
    user.resetOTP = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;