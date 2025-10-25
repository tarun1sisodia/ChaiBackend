import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //In future add the feature to make file name more robust and safe and also change the filename function more better version
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
