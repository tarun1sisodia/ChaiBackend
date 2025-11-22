import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // TO Enable searching field with more optimization
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
// added the logic to  hash the password before saving it if password is being modified.
// Pre Says run me before saving anything into DB
userSchema.pre("save", async function (next) {
  // fixed the isModified Typo Error
  // Password modified nhi hua h to this next() krdo taki vo age run kr sake code and save krde.
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch {
    (err) => next(err);
  }
});

// Check krna bhi baht important h ki password sahi h ya nhi
// custom methods to check password is correct or not?
// password user pass krega yahan
userSchema.methods.isPasswordCorrect = async function (password) {
  // bcrypt return krega false ya true.
  // password--user, this.password - encrptyed passworded
  return await bcrypt.compare(password, this.password);
};

// Midldlewares
// Tokens are same only difference is EXPIRY Duration of them.
// Access Token - SHORT
userSchema.methods.generateAccessToken = function () {
  // Note: jwt.sign is synchronous if a callback is not provided
  // Always return the token so it can be used where the method is called
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Refresh Token - LONG Term
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
/* 
Think of a hotel:

Access Token = Your room key card
  Works for a short time (e.g., until checkout)
  Gives you access to your room
  If stolen, limited damage (expires soon)


Refresh Token = Your ID at the front desk
  Lasts much longer
  Used to get a NEW room key when the old one expires
  Kept more securely
*/
