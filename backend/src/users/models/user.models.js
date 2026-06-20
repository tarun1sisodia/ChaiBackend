import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: Sring,
        required: [true, "password is required"]
        // If the username or password contains special characters like $ : / ? # [ ] @, they must be percent-encoded.

    },
    isActive: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);