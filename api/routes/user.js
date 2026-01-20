import express from "express";

const router = express.Router();

// Sample route
router.get("/", (req, res) => {
  res.send("User route is working");
});
export default router;