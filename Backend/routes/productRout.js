import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {

  res.json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path,
  });
});

export default router;