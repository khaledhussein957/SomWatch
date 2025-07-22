import express from "express";

import { login, register, forgotPassword, resetPassword, updatePassword, updateProfile } from "../controllers/auth.controller.js";

import protectRoute from "../middlewares/protect.middleware.js";
import upload from '../middlewares/upload.js';

const router = express.Router();

// Auth routes
router.post("/login", login);
router.post("/register", register);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// privte routes
router.put("/update-password", protectRoute, upload.single("avatar"), updatePassword);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
