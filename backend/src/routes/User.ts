import express from "express";
import { Router } from "express";
import Client from "../db";
import nodemailer from "nodemailer";

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
//@ts-ignore
router.post("/signup", async (req, res) => {
  const { name, email, dob, password } = req.body;

  try {
    const existingUser = await Client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //storing data temporarily in redis

    const userData = {
      name,
      email,
      dob,
      password,
    };

    //generate a random otp

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
    await Client.user.create({
      data: {
        name,
        email,
        dob: new Date(dob),
        password,
        otp: otp.toString(),
        otpExpiry: expiryTime,
        isVerified: false,
      },
    });

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

export default router;
