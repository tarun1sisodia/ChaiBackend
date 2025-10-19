// require("dotenv").config({ path: "./env" });  // It will work fine w/o issue

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT ${process.env.PORT}`);
    });
    app.on("error", (error) => {
      console.log(`Error at Connection time: ${error}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB Connection failed !! ${error}`);
  });
