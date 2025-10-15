import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      ` MongoDB connected ~~ DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (err) {
    console.error(`Error:${err}`);
    // throw err; not necessary to use it.
    process.exit(1); // Need to read on this .
  }
};

export default connectDB;
