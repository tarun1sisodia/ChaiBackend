import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const serverHealth = asyncHandler(async (_, res) => {
  console.log(`You hit the health API`);

  return res.status(200).json(new ApiResponse(200, "HEALTH"));
});

export default serverHealth;
