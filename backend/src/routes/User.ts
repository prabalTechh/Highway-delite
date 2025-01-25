import express from "express";
import { Router } from "express";
import Client from "../db";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { middleware } from "../middleware";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const router = Router();

// @ts-ignore
router.post("/signup", async (req, res) => {
  const { name, email, dob, password } = req.body;

  try {
    const existingUser = await Client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // OTP expiry in 5 minutes

    await Client.user.create({
      data: {
        name,
        email,
        dob: new Date(dob),
        password: hash, // Store the hashed password, not plain text
        otp: otp.toString(),
        otpExpiry: expiryTime,
        isVerified: false,
      },
    });

    // Send verification email with OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to [Your App Name]!</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Registration initiated successfully" });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// OTP Verification Endpoint
//@ts-ignore
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await Client.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update the user's verification status
    await Client.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiry: null },
    });

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.log("Error in OTP verification", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signin Route (with password validation and verification)
//@ts-ignore
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Find user by email
    const user = await Client.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          error:
            "User is not verified. Please verify your account before signing in.",
        });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Sign-in successful.",
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res
      .status(500)
      .json({
        error: "An error occurred during sign-in. Please try again later.",
      });
  }
});

router.get("/profile", middleware ,async (req, res) => {
//@ts-ignore
  const userId = req.userId;

  try {
    const users = await Client.user.findFirst({
      where:{
        id: userId
      }
    });
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
