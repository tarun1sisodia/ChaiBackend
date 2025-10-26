import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

// connecting to Database by calling the file
connectDB()
  .then(() => {
    // listening on PORT 
    app.listen(PORT, () => {
      console.log(`Server is running at PORT http://localhost:${PORT}`);
    });
    // If We get an error During Connection
    app.on("error", (error) => {
      console.log(`Error at Connection time: ${error}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB CONNECTION FAILED !! ${error}`);
  });
