import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// set up whole middleware configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
  express.json({ limit: "16kb" }),
  express.urlencoded({ extended: true, limit: "16kb" }),
  express.static("public"),
  cookieParser(),
);

// routes import
import userRouter from "./routes/user.routes.js";

// routes Declaration
// Here User hit and router just pass it to UserRouter
app.use("/api/v1/users", userRouter);

// http://localhost:8000/api/v1/users/register
export { app };
