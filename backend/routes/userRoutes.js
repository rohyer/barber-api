const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  updateUserData,
  updateUserPassword
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/:id", protect, updateUserData);

router.put("/password/:id", protect, updateUserPassword);

module.exports = router;
