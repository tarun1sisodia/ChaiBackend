import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "created account",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "User Found",
  });
});

export { registerUser };
export { loginUser };
