import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT http://localhost:${PORT}`);
    });
    app.on("error", (error) => {
      console.log(`Error at Connection time: ${error}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB CONNECTION FAILED !! ${error}`);
  });
