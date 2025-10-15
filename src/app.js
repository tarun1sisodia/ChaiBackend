import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Configuration of App
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  }),
  express.json({
    limit: "16kb",
  }),
);
//if above not works use this.
// app.use(express.json({}));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };
