import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log(cloudinary);

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // if Local path not found or null
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      // type of data we are storing on cloudinary
      resource_type: "auto",
    });
    // Successfully uploaded file
    console.log(
      `File has been uploaded Successfully !! Local File Path ->${localFilePath} & Public URL ->${response.url} & More data ${response}`,
    );
    // if successfully 
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // removing the locally saved file because the upload failed.. so unlinking the Temporary stored..
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
