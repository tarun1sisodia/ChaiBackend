import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

import logger from "./utils/logger.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
logger.info(`Starting GAME`);

// connecting to Database by calling the file
connectDB()
  .then(() => {
    // listening on PORT
    app.listen(PORT, () => {
      logger.info(`Server is running at PORT http://localhost:${PORT}`);
    });
    // If We get an error During Connection
    app.on("error", (error) => {
      logger.error(`Error at Connection time: ${error}`);
    });
  })
  .catch((error) => {
    logger.error(`MONGODB CONNECTION FAILED !! ${error}`);
  });
