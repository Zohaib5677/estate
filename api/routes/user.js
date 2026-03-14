import express from "express";
import User from "../models/user.js";  // adjust path
const router = express.Router();
import { verifyToken } from '../controllers/auth.js';
import { getUser } from '../controllers/listing.js';
// Sample route
router.get("/", (req, res) => {
  res.send("User route is working");
});


router.post("/update/:id", async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" }).clearCookie("token");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateimage/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { avatar: req.body.image } },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/:id', verifyToken, getUser)
export default router;
