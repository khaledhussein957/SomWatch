import express from 'express';

import { getUserProfile, updateProfile, syncUser, getCurrentUser } from '../controllers/user.controller.js';

import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/profile/:username", getUserProfile);

router.put("/profile", protectRoute, updateProfile);

router.post("/sync", protectRoute, syncUser);

router.get("/me", protectRoute, getCurrentUser);



export default router;