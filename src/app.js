import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// MIDDLEWARE (Think of these as security guards and helpers)

// 1. CORS - Allow frontend to talk to backend
app.use(
  cors({
    // cors is a middleware that allows you to make requests to your API from different domains.
    origin: process.env.CORS_ORIGIN, // Which websites can access your API
    credentials: true, // ⚠️ You wrote "Credential" - should be "credentials"
  }),
);

// 2. Parse JSON data from requests
app.use(express.json({ limit: "16kb" }));

// 3. Parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 4. Serve static files (images, PDFs, etc.)
app.use(express.static("public"));

// 5. Parse cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hey there! Welcome to the BloodConnect Backend");
});

app.post("/user", (req, res) => {
  console.log("Received data:", req.body);
  res.json({ message: "User Received", user: res.body });
});

export { app };
