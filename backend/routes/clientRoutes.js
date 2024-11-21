const express = require("express");
const router = express.Router();
const {
  getClients,
  registerClient
} = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getClients);

router.post("/", protect, registerClient);

// router.put("/:id", protect, updateClients);

// router.delete("/:id", protect, deleteClients);

module.exports = router;
