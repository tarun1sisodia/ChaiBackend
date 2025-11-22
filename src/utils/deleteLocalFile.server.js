import fs from "fs";
const deleteLocalFiles = async (filePath) => {
  try {
    console.log(`Trying to Delete Local FILES`);
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Failed to delete local files.", error);
  }
};

export default deleteLocalFiles;
