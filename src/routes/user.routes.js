import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
router.route("/login").get(loginUser);
console.log(router);
// console.log(upload.fields());

// Health API
router
  .route("/health")
  .get((req, res) => res.send(new ApiResponse(200, `Server is Healthy`)));
export default router;
