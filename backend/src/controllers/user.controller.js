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

        // check if user already exists in mongodb
        const existingUser = await User.findOne({ clerkId: userId });
        if (existingUser) {
            return res.status(200).json({ user: existingUser, message: "User already exists" });
        }

        // create new user from Clerk data
        const clerkUser = await clerkClient.users.getUser(userId);

        const userData = {
            clerkId: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: clerkUser.firstName + " " + clerkUser.lastName,
            username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
            avatar: clerkUser.imageUrl || "",
        };

        const user = await User.create(userData);

        res.status(201).json({ user, message: "User created successfully" });

    } catch (error) {
        console.error("Error syncing user:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const user = await User.findOne({ clerkId: userId });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}