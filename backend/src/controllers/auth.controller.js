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

export const callBack = async (req, res) => {
    try {
        const code = req.query.code;

        // 1. Exchange code for access token
        const { data } = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: ENV.GOOGLE_CLIENT_ID,
            client_secret: ENV.GOOGLE_CLIENT_SECRET,
            redirect_uri: ENV.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });

        // 2. Get user info
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
            },
        });

        const { email, name, picture } = userInfo.data;

        // 3. Create or fetch user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                username: email.split("@")[0], // Use email prefix as username
                avatar: picture,
                fromGoogle: true,
            });
        }

        // 4. Create JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // 5. Redirect or return token
        res.redirect(`somwatch://login-success?token=${jwtToken}`);
        // OR for mobile:
        // res.json({
        //     token: jwtToken, user: {
        //         ...user._doc,
        //         password: undefined,
        //     }
        // });

    } catch (error) {
        console.error("Error in callBack:", error.response?.data || error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
