import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
  if (
    // import in an array whole data and using some to check are empty or not for validation
    [fullName, username, email, password].some((field) => field?.trim()) === ""
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // checking if user exists or not with email or username
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  // if user exists then throwing an error
  if (existedUser)
    throw new ApiError(409, "User with email or Username already existed");
  // console.log(existedUser);

  // confusin for me now, need to revise and understand it more better
  // we are receiving the path of file of localServer and passing in new vars
  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // Checking if Avatar is on Local server or not.
  if (!avatarLocalpath) throw new ApiError(400, "Avatar file is required");

  // Uploading on Clodinary .
  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // checking if avatar is successfully uploaded on Cloudinary
  if (!avatar) throw new ApiError(400, "Avatar file is required");
  // if (!coverImage) throw new ApiError(400, "Cover Image file is required");

  // Creating Account on MongoDB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // making an api Call but suring ourself user is created and has id
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
  res.status(200).json({
    message: "User Found",
  });
});

export { registerUser };
export { loginUser };
