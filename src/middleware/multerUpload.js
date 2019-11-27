import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cld from "../config/cloudinaryConfig";

const storage = cloudinaryStorage(
  {
    cloudinary: cld,
    folder: "teamwork-api-gifs",
    allowedFormats: ["gif"],
  },
);

console.log(storage);

const multerUploads = multer({ storage }).single("image");

export default multerUploads;
