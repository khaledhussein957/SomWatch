import express from "express";

import { login, register, callBack, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

import getGoogleAuthURL from "../utils/googleOauthUrl.js";

const router = express.Router();

// Auth routes
router.post("/login", login);
router.post("/register", register);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth routes
router.get("/google", (req, res) => {
  const url = getGoogleAuthURL();
  res.redirect(url);
});

router.get("/google/callback", callBack);

export default router;
