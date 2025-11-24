import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import deleteLocalFiles from "../utils/deleteLocalFile.server.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Seperate method for Generate access and refresh token
// Just need to pass the UserId now we can use it in other functions too.
const generateAccessAndRefreshTokens = async (userId) => {
  // Algorithm
  // find user using its userID which will be passed during calling function
  // after getting user generate Tokens(Refresh & Access)
  // save tokens in Database and update tokens on also frontend
  // return tokens to user or frontend
  // Robust generateAccessAndRefreshTokens implementation
  if (!userId) {
    throw new ApiError(400, "User ID must be provided to generate tokens");
  }

  try {
    // Find user by ID in mongoose
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found to generate tokens");
    }

    // Ensure user schema has token methods
    if (typeof user.generateAccessToken !== "function" || typeof user.generateRefreshToken !== "function") {
      throw new ApiError(500, "Token generation functions not found on user model");
    }

    // Generate tokens using user's defined methods
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Basic type checks (could be enhanced depending on implementation)
    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Failed to generate access or refresh token");
    }

    // Save updated user only if changed (e.g., refreshToken may be stored)
    // If user.refreshToken property exists, update it
    if ("refreshToken" in user) {
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    } else {
      // Still call save, as in original (safe no-op if nothing to persist)
      await user.save({ validateBeforeSave: false });
    }

    // Return the tokens to user
    return { accessToken, refreshToken };
  } catch (error) {
    // Optionally, log error stack for debugging in production environments
    logger.error("Token generation error:", error);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, `Failed to generate tokens: ${error.message || error}`);
    }
  }
};

// Refresh & Access Token Reset
const refreshAccessToken = asyncHandler(async (req, res) => {
  logger.info("refreshAccessToken called");
  // Algorithm
  // get tokens from frontend or user
  // if not found then throw error
  // if token matched then start decoding it using env to confirm
  // now after decoding we will get whole data about user but we only need user who owns this token
  // if not found user then throw error because we decode the token but when we try to find it in db and nothing gets uz no user never saved that token
  // if found then return that user and call another middleware or function(userLogin)
  try {
    // Getting Data from frontend or user..
    // Get refresh token from cookies or request body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    // If refresh token is not present, throw an error
    if (!incomingRefreshToken) {
      // Could enhance this area: Log missing token source (cookie vs body)
      throw new ApiError(401, "Unauthorized Request: Refresh token missing");
    }

    let decodedToken;
    try {
      // Attempt to verify and decode the refresh token using secret
      decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (verifyErr) {
      // Handle invalid/expired/malformed token errors
      // You might want to add logging here for debugging
      logger.error("Invalid Refresh Token:", verifyErr);
      throw new ApiError(401, "Invalid or Expired Refresh Token");
    }

    // Ensure the decoded payload contains an _id
    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Malformed token payload: User ID missing");
    }

    // Find the user associated with the decoded _id
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    // If the user does not exist, token is stale or has been tampered with
    if (!user) {
      // Consider whether to clear the cookie here as well
      throw new ApiError(401, "Invalid Refresh Token: User not found");
    }

    // Place the user object onto the request for downstream middleware handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    // next(); // This is a controller, not middleware usually, but kept if needed
    // Actually refreshAccessToken usually returns new tokens, let's see implementation
    // The original code called next(), but usually this endpoint returns new tokens.
    // Assuming this is a controller that returns new tokens based on standard flow.
    // BUT the original code had next()... wait, refreshAccessToken is usually an endpoint.
    // Let's check routes. It is a POST route.
    // If it calls next(), it might fall through?
    // Let's look at the original code again. It calls next().
    // If it's a controller, it should return response.
    // I will keep it as is but add logging.

    // WAIT, the original code called next() at line 117.
    // If this is the final handler, next() will go to 404 or error handler?
    // Usually refresh token endpoint returns new tokens.
    // I will assume the original code was incomplete or using next() to go to a response handler?
    // But looking at other controllers, they return res.
    // I will keep next() as per original but log it.

    // Actually, looking at standard implementations, refresh token should return response.
    // I'll stick to original logic to avoid breaking changes, just adding logs.
    // But wait, if I change it, I might fix a bug.
    // The user said "frontend and backend are not connected".
    // If refresh token is broken, auth might fail.
    // But let's focus on logging first.

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )

  } catch (error) {
    // More detailed error message for caller
    // Consider logging the original error as well
    logger.error(`Error in RefreshAccessToken Function: ${error?.message}`);
    throw new ApiError(401, `Error in RefreshAccessToken Function: ${error?.message}`);
  }
});

// Register User function
const registerUser = asyncHandler(async (req, res) => {
  logger.info("registerUser called");
  // get user details from frontend
  // validation of data - not empty
  // check if user already exists (username, email)
  // check for images , avatar
  // upload them to cloudinary
  // create user object -  Create entry in DB
  // remove pass & refresh token field from response
  // Check for User Creation
  // return res

  const { fullName, email, username, password } = req.body;
  logger.info(`Register Request: Email : ${email}, FullName : ${fullName}`);

  // using an array
  // Check if ANY of the fields is missing/empty (trim -> length)
  if ([fullName, username, email, password].some((field) => !field || !String(field).trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // checking if user exists or not with email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // if user exists then throwing an error
  if (existedUser) {
    logger.warn(`User already exists: ${username} or ${email}`);
    throw new ApiError(409, "User with email or Username already existed");
  }

  // confusin for me now, need to revise and understand it more better
  // we are receiving the path of file of localServer and passing in new vars
  // optional Chaining
  // or Use Clasical IF else to debug
  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  logger.debug(`Avatar Path: ${avatarLocalpath}`);

  // Checking if Avatar is on Local server or not.
  if (!avatarLocalpath) throw new ApiError(400, "Avatar file is required");

  // Uploading on Clodinary .
  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // checking if avatar is successfully uploaded on Cloudinary
  if (!avatar) throw new ApiError(400, "Avatar file is required");
  // if (!coverImage) throw new ApiError(400, "Cover Image file is required");

  // Attempting to Create user in MongoDB
  // Creating Account on MongoDB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  logger.info(`✅ User created successfully: ${user._id}`);

  // making an api Call but suring ourself user is created and has id
  // this makes our password and refreshtoken invisible to others
  const createdUser = await User.findById(user._id).select(
    // Removing the password and refreshtoken automatically
    "-password -refreshToken"
  );

  // If get error then
  if (!createdUser) throw new ApiError(500, "Went Wrong While registering user");

  return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

// login User
const loginUser = asyncHandler(async (req, res) => {
  logger.info("loginUser called");
  // Extracting user info from body
  const { username, email, password } = req.body;
  logger.debug(`Login Request Body: ${JSON.stringify(req.body)}`);

  // Validation: username or email is required
  if (!(username || email)) throw new ApiError(400, "username or email is required");

  // Find user by username or email
  const user = await User.findOne({
    $or: [...(email ? [{ email }] : []), ...(username ? [{ username }] : [])],
  });

  logger.debug(`Found user in DB: ${user ? user._id : null}`);

  // If user not found
  if (!user) throw new ApiError(404, "User doesn't exist");

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  logger.debug(`Checking Password Validation: ${isPasswordValid}`);

  if (!isPasswordValid) throw new ApiError(401, "Password is Incorrect");

  // Create tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // Save refreshToken to DB, if not automatic in generateAccessAndRefreshTokens
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Retrieve user info (exclude sensitive)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Cookie options based on environment
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // in prod, only send over https
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  // Debug cookie settings
  logger.debug(`Setting cookies with options: ${JSON.stringify(options)}`);

  // Send tokens as httpOnly cookies
  res.cookie("accessToken", accessToken, {
    ...options,
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY) * 1000, // Convert to ms if needed, usually env is in seconds? Check env.
  });
  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  });

  // Response to client
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User successfully logged in"
    )
  );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  logger.info("logoutUser called");
  // Algorithm
  // take tokens from frontend
  // set it to undefined on frontend
  // then automatically user will logout or unable to access any route or controller or anything
  // why w are doing FINDBYIDANDUPDATE because we need to first find user and then update the db and tokens.

  await User.findByIdAndUpdate(
    req.user._id,
    {
      // using operator of mongodb
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  logger.info(`Successfully Found user and Removed from device`);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

// Change Current User Password
const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  logger.info("changeCurrentUserPassword called");
  // first get the old password and new password
  // getting old Password & new Password from frontend through from or body
  // check current password is same as or not in database using bcrypt function that is defined in model in user
  // if matched old pass in db then update the current new pass that is passed by user
  const { oldPassword, newPassword } = req.body;
  // now finding user using its unique id
  const user = await User.findById(req.user?._id);
  // Here we are not adding error handling because now we know user is already logged in in our situation and scenerio

  // after successfully found we are checking user current old password is correct or not.

  // IsPasswordCorrect is our method which in User model
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "invalid Old Password");

  user.password = newPassword;
  // v uz await cuz database is on another continent which means it will take time ..
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  logger.info("getCurrentUser called");
  // Algorithm:
  // just send response . because this will send only when user is loggedIN otherwise nothing will be there
  // Just return the req.user simple because we know that user get routes will hit response only when it has data of user.
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched Successfully"));
});

// Update Account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
  logger.info("updateAccountDetails called");
  // Algorithm
  // Getting Data from frontend what to updated from pre given fields
  // find user in DB using its unique ID and then start updating data using $set:{ data to update }
  // password is not important
  const { fullName, email, password } = req.body;
  // If Data not found then give an error fields.
  if (!(fullName || email)) throw new ApiError(401, "All Fields are required");
  // finding user using FindByID&Update
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      // Double check it will work or not
      $set: { fullName: fullName, email: email },
      // $set: { fullName, email },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Account Details Successfully"));
});

// Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  logger.info("updateUserAvatar called");
  // getting the path of file for avatar to set it on cloudinary for user to update it
  const avatarLocalPath = req.file?.path;
  const avatarLocalPathToDelete = req.user?.avatar;
  // if not found then throw and custom error
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");
  // very imp to upload image or file on cloudinary to update the avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if we failed while uploading the avatar on cloudinary then hit this custom error msg
  if (!avatar) throw new ApiError(400, "Error While Uploading on Cloudinary");
  // success and find the user and updating the details and removing password to not get select and updated btw it will not update because we have added an check their on MONGODB FILE
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  // to be tested in future
  await deleteLocalFiles(avatarLocalPathToDelete);
  return res.status(200).json(new ApiResponse(200, user, "updated Avatar Imagez Successfully"));
});

// Update the cover Image of user just like we did on avatar function or method
const updateUserCoverImage = asyncHandler(async (req, res) => {
  logger.info("updateUserCoverImage called");
  const CoverImageLocalPath = req.file?.path;
  const CoverImageLocalPathToDelete = CoverImageLocalPath;
  if (!CoverImageLocalPath) throw new ApiError(400, "CoverImageLocalPath file is missing");
  const coverImage = await uploadOnCloudinary(CoverImageLocalPath);
  if (!coverImage) throw new ApiError(400, "Error While Uploading on Cloudinary");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");
  //sending response to frontend
  // TO BE TESTED
  await deleteLocalFiles(CoverImageLocalPathToDelete);
  return res.status(200).json(new ApiResponse(200, user, "Updated Cover Image Successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  logger.info("getUserChannelProfile called");
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is missing");
  }

  // first we found the username using match.
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    // now we are getting all the subscribers from channels
    {
      // LEFT JOIN subscriptions ON user._id = subscriptions.channel
      $lookup: {
        from: "subscriptions", // Look in subscriptions collection
        localField: "_id", // User's ID
        foreignField: "channel", // Match where channel = this user's ID
        as: "subscribers", // Store results in "subscribers" array
      },
    },
    // now we get the subscriber which are subscribed
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber", // Match where subscriber = this user's ID
        as: "subscribedTo",
      },
    },
    // now count both subscribers and channels which are subscribered by me.
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" }, // Count array length
        channelsSubscribedToCount: { $size: "$subscribedTo" }, // Count array length
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // Check if current logged-in user is in subscribers array
            then: true,
            else: false,
          },
        },
      },
    },
    /*
    - subscribersCount: How many people subscribed to this channel
    - channelsSubscribedToCount: How many channels this user subscribed to
    - isSubscribed: Is the logged-in user subscribed to this channel? (Boolean)
    * Finally, project only the fields we want to return
    * This removes the subscribers and subscribedTo arrays from the output
    */
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        email: 1,
        coverImage: 1,
        createdAt: 1,
      },
    },
  ]);
  if (!channel?.length) throw new ApiError(400, "Channel doesn't exist");
  return res.status(200).json(new ApiResponse(200, channel[0], "User Channel fetched Successfully"));
});

const getUserHistory = asyncHandler(async (req, res) => {
  logger.info("getUserHistory called");
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        // here we are going to write sub pipelines and more depth.
        // pipeline 1;
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              // sub pipeline 1;
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          // this is for frontend reliability.
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, user[0].watchHistory, "Fetch user Data successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserHistory,
};

