import multer from "multer";

const storage = multer.diskStorage({
  // to where the files stored
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // public url of file that uploaded by user
  filename: function (req, file, cb) {
    // In future add the feature to make file name more robust and safe and also change the filename function more better version
    cb(null, file.originalname);
  },
});
// console.log(storage);

export const upload = multer({ storage: storage });
