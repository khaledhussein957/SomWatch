import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
};

export const syncUser = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // check if user already exists in mongodb
        const existingUser = await User.findOne({ clerkId: userId });
        if (existingUser) {
            return res.status(200).json({ user: existingUser, message: "User already exists" });
        }

        // create new user from Clerk data
        const clerkUser = await clerkClient.users.getUser(userId);

        // Validate Clerk user data
        if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
            return res.status(400).json({ error: "Invalid user data from Clerk" });
        }

        const userData = {
            clerkId: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User',
            username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
            phone: clerkUser.phoneNumbers && clerkUser.phoneNumbers.length > 0 ? clerkUser.phoneNumbers[0].phoneNumber : "",
            avatar: clerkUser.imageUrl || "",
        };

        // Validate username uniqueness
        const existingUsername = await User.findOne({ username: userData.username });
        if (existingUsername) {
            userData.username = `${userData.username}_${Date.now()}`;
        }

        const user = await User.create(userData);

        res.status(201).json({ user, message: "User created successfully" });

    } catch (error) {
        console.error("Error syncing user:", error);

        // More specific error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Invalid user data" });
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists with this data" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ clerkId: userId });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}