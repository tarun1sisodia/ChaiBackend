import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express();
/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log(`App is not able to integrate ${error}`);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.error(`ERROR: ${e}`);
    throw err;
  }
})();
*/