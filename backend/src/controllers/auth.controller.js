import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";

import User from "../models/user.model.js";

export const login = async (req, res) => {
    try {
        // login with username or email or phone
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find user by username, email, or phone
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }, { phone: identifier }],
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            },
            token
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const register = async (req, res) => {
    try {
        const { name, username, email, password, phone } = req.body;
        if (!name || !username || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { phone }],
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            phone,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            success: true, user: {
                ...newUser._doc,
                password: undefined,
            }, token
        });

    } catch (error) {
        console.log("Error in register:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        // email or phone
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ success: false, message: "All fields is required" });
        }

        // Find user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update user's OTP and expiration time
        user.otp.code = otpCode;
        user.otp.expiresAt = expiresAt;
        await user.save();

        //TODO: send OTP via email or SMS

        // For simplicity, we will just log it to the console
        console.log("OTP code:", otpCode);

        res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.log("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { otpCode, newPassword } = req.body;
        if (!otpCode || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields is required" });
        }

        // Find user by OTP code
        const user = await User.findOne({ otp: { code: otpCode, expiresAt: { $gt: Date.now() } } }); // Check if OTP is valid and not expired
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        user.otp = null; // Clear OTP
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.log("Error in updatePassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, username, email, phone } = req.body;
        if (!name || !username || !email || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user's profile
        user.name = name;
        user.username = username;
        user.email = email;
        user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            },
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.log("Error in updateProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};