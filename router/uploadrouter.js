const express = require("express");
const uploadController = require("../controller/uploadController.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});
const upload = multer({ storage: storage });
const Router = express.Router();
Router.post(
  "/fileUpload/:id",
  upload.single("file"),
  uploadController.fileUpload
);

module.exports = Router;
