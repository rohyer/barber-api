const express = require("express");
const router = express.Router();
const {
  getClients,
  registerClient,
  updateClient,
  deleteClient
} = require("./client.controller");
const { protect } = require("../../middleware/authMiddleware");
const { cacheMiddleware } = require("../../middleware/cacheMiddleware");

router.get("/", protect, cacheMiddleware, getClients);

router.post("/", protect, registerClient);

router.put("/:id", protect, updateClient);

router.delete("/:id", protect, deleteClient);

module.exports = router;
