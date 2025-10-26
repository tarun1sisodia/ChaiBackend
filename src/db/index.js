import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log(uri);

    // Connecting to MongoDB
    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `MongoDB connected && DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (err) {
    console.error(`MONGODB Connection Failed at DB :${err}`);
    // process.exit(1); // Exit the app if database fails
  }
};

export default connectDB;
