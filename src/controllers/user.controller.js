import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// Seperate method for Generate access and refresh token
// Just need to pass the UserId now we can use it in other functions too.
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // find user by ID in monoose
    const user = await User.findById(userId);

    // generating token using our defined methods in user.model.js
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // now save them in DB / MongoDB
    // use document/ object to save
    await user.save({ validateBeforeSave: false });

    // Return the Tokens to user
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to Generate Tokens");
  }
};

// Register User function
const registerUser = asyncHandler(async (req, res) => {
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
  console.log(`Email : ${email}`);
  console.log(`Password : ${password}`);
  console.log(`FullName : ${fullName}`);

  // using an array
  // Check if ANY of the fields is missing/empty (trim -> length)
  if (
    [fullName, username, email, password].some(
      (field) => !field || !String(field).trim(),
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // checking if user exists or not with email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // if user exists then throwing an error
  if (existedUser)
    throw new ApiError(409, "User with email or Username already existed");
  // console.log(existedUser);

  // confusin for me now, need to revise and understand it more better
  // we are receiving the path of file of localServer and passing in new vars
  // optional Chaining
  // or Use Clasical IF else to debug
  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log(avatarLocalpath[1]?.path);

  /*  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  );
  {
    coverImageLocalPath = req.files.coverImage[0].path;
  } */
  console.log(req.files);

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

  console.log("✅ User created successfully:", user._id);
  console.log("Email:", user.email);
  console.log("Password hash:", user.password);

  // making an api Call but suring ourself user is created and has id
  // this makes our password and refreshtoken invisible to others
  const createdUser = await User.findById(user._id).select(
    // Removing the password and refreshtoken automatically
    "-password -refreshToken",
  );

  // If get error then
  if (!createdUser)
    throw new ApiError(500, "Went Wrong While registering user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

// login User
const loginUser = asyncHandler(async (req, res) => {
  // Algorithm for LOGIN USER
  // 1. Get user details from frontend (username/email, password)
  // 2. Validation - check if fields are not empty
  // 3. Check if user exists in DB (by username or email)
  // 4. If user doesn't exist, return error or message to use using APIError
  // 5. Compare plain password with hashed password in DB (using bcrypt.compare)
  // 6. If password doesn't match, return error
  // 7. Generate access token and refresh token
  // 8. Save refresh token to DB (in user document)
  // 9. Send tokens via cookies (httpOnly, secure)
  // 10. Return response with user data (exclude password)
  // De-structuring the the data from req.body
  const { username, email, password } = req.body;
  console.debug(`req.body ${req.body}`);

  // if username NOR email entered then ..
  // if we want only one .
  if (!(username || email))
    throw new ApiError(400, "username or email is required");
  console.debug(`Atleast Provide username / email`);

  // Logic to find user
  const user = await User.findOne({
    // Finding user using either find email or username
    $or: [{ email }, { username }],
  });
  console.debug(`Found user in DB: ${user}`);

  // user doesn't exist in DB then ?
  if (!user) throw new ApiError(404, "user doesn't exist");

  // check password is correct or not.
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(`Checking Password Validation: ${isPasswordValid}`);

  // password doesn't exist or not matched
  if (!isPasswordValid) throw new ApiError(401, "Password is Incorrect");

  // generate the tokens using our top above methods
  // de- structure
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  console.log(`Creating Tokens for user to stay login in system or app.`);

  // either update user or make a new DB Call
  // we choose to make a DB call and got getting password and refreshToken
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  console.log(
    `Excluding Server or DB to not find user._id by password or exclude password and refreshToken`,
  );

  // Adding Security on Cookies now they are only modifiable by backend , on frontend we can only see them
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };

  // This return response will have all important data.
  console.log(`User Logged in Successfully: ${loggedInUser}`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Successfully Loggedin",
      ),
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // why w are doing FINDBYIDANDUPDATE because we need to first find user and then update the db and tokens.
  console.log(
    `Removing User's Access & Refresh Tokens to discontent with our services`,
  );
  console.log(
    `Finding User by its ID and Updating the DB to undefined or clear the Tokens from his database`,
  );

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
    },
  );
  console.log(`Successfully Found user and Removed from device`);

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

// Refresh & Access Token Reset
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // Getting Data from frontend or user..
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    // if not found any data on frontend  then throw error
    if (!incomingRefreshToken) throw new ApiError(401, "UnAuthorized Request");

    // if Found Token from frontend then start verifying it using ENV
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // now find the who has that token and get its id only not password and refreshToken
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );
    // user not found because token is wrong
    if (!user) throw new ApiError(401, "Invalid Refresh Token");
    // passing the user in response
    // calling next ()
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      `${error?.message}Caught Error While RefreshAccessToken Function `,
    );
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
