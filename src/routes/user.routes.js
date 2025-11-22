import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import serverHealth from "../controllers/server.health.js";

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
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-avatar").post(updateUserAvatar);

export default router;
