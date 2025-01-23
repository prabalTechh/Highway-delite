"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const router = (0, express_1.Router)();
// @ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, dob, password } = req.body;
    try {
        const existingUser = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Hash the password
        const hash = yield bcryptjs_1.default.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // OTP expiry in 5 minutes
        yield db_1.default.user.create({
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
        yield transporter.sendMail({
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
    }
    catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// OTP Verification Endpoint
//@ts-ignore
router.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield db_1.default.user.findUnique({
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
        yield db_1.default.user.update({
            where: { email },
            data: { isVerified: true, otp: null, otpExpiry: null },
        });
        res.status(200).json({ message: "User verified successfully" });
    }
    catch (error) {
        console.log("Error in OTP verification", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Signin Route (with password validation and verification)
//@ts-ignore
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        // Find user by email
        const user = yield db_1.default.user.findUnique({
            where: { email },
        });
        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: 'User is not verified. Please verify your account before signing in.' });
        }
        // Compare password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password.' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Sign-in successful.',
            token,
        });
    }
    catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'An error occurred during sign-in. Please try again later.' });
    }
}));
exports.default = router;
