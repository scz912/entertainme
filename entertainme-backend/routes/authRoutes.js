const express = require("express");
const transporter = require("../mailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require("passport");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, googleSignupToken } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    let googleId = null;

    if (googleSignupToken) {
      let decoded;
      try {
        decoded = jwt.verify(googleSignupToken, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({
          message: "Your Google sign-up session has expired. Please sign in with Google again.",
          code: "GOOGLE_TOKEN_EXPIRED"
        });
      }

      if (decoded.purpose !== "google-signup") {
        return res.status(400).json({
          message: "Invalid Google signup token"
        });
      }

      if (decoded.email !== email) {
        return res.status(400).json({
          message: "Google email does not match"
        });
      }

      googleId = decoded.googleId;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      googleId
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
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

// GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signin.html`,
    session: false
  }),

  (req, res) => {
    // New Google user: redirect to signup page
    if (req.user.isNewGoogleUser) {
      const googleSignupToken = jwt.sign(
        {
          email: req.user.email,
          googleId: req.user.googleId,
          name: req.user.name,
          purpose: "google-signup"
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/signup.html?googleSignupToken=${googleSignupToken}`
      );
    }

    // Existing user: login directly
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || ""
      })
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/googleCallback.html?token=${token}&user=${userData}`
    );
  }
);

module.exports = router;