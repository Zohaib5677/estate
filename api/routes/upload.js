import express from 'express';
import upload from "../middleware/cloudinaryStorage.js";
const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded or wrong field name. Make sure key is 'image'."
      });
    }

    res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;