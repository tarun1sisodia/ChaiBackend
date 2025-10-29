import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Setting up router apis
// /register will call the post method(Register user) and what and how much to upload on localServer
router.route("/register").post(
  // what to upload and how much
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  // Calling the Method
  registerUser,
);
router.route("/login").post(loginUser);
console.log(router);
// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);

// Health API
router
  .route("/health")
  .get((req, res) => res.send(new ApiResponse(200, `Server is Healthy`)));

export default router;
