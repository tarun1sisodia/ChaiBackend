import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env FIRST
dotenv.config({ path: ".env" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

console.log("🚀 Testing connection to:", uri);

await mongoose
  .connect(uri)
  .then(() => {
    console.log(`✅ SUCCESS! Connected to DB: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    process.exit(0); // Exit cleanly
  })
  .catch((err) => {
    console.error("❌ FAILED to connect:", err.message);
    process.exit(1);
  });
