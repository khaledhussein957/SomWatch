import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        sparse: true, // <-- important for optional fields
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true,
        unique: true,
        validate: {
            validator: (email) => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: "Invalid email",
        },
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    clerkId: {
        type: String,
        unique: true,
        sparse: true,
    },
    location: {
        type: String,
        default: "",
    },
    otp: {
        code: String,
        expiresAt: Date,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
    }],
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
