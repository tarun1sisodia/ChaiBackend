import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `MongoDB connected ~~ DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (err) {
    console.error(`MONGODB Failed Error:${err}`);
    // throw err; not necessary to use it.
    process.exit(1); // Need to read on this .
  }
};
//exporting the function outside.
export default connectDB; 
