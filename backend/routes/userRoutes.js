const express = require("express");
const router = express.Router();
const app = express();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  updateUserData,
  updateUserPassword,
  updateUserEmail
} = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/:id", protect, updateUserData);

router.put("/password/:id", protect, updateUserPassword);

router.put("/email/:id", protect, updateUserEmail);

module.exports = router;
