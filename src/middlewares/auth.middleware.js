import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Accessing the Token from Cookies or Authorization and replace the Bearer with empty string
    const token =
      req.cookies?.accessToken ||
      req.Header("Authorization")?.replace("Bearer ", "");

    // if token did not work or found
    if (!token) throw new ApiError(401, "UnAuthorized Request");

    // verifying the token by decoding it
    const decodeToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    // and after decode finding user by which token we got the id and also exlusiving password and refreshToken
    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken",
    );

    // userID mili ni to ye run hoga
    if (!user) throw new ApiError(401, "Invalid Access Token");

    //  user mil gya to ye run hoga aur next se call hoga agla functions.
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
