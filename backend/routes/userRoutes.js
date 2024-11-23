const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  updateUserData
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/:id", protect, updateUserData);

module.exports = router;
