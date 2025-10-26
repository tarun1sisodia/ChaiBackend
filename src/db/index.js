import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}`;
    // const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log(uri);

    // Connecting to MongoDB
    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `********************Connection Name: ${connectionInstance.connection.name}********************\n********************Database Name:   ${connectionInstance.connection.db.databaseName}********************`,
    );
  } catch (err) {
    console.error(`MONGODB Connection Failed at DB :${err}`);
    // process.exit(1); // Exit the app if database fails
  }
};

export default connectDB;
