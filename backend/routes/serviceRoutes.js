const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getServices,
  setService,
  updateServices
} = require("../controllers/serviceController");

router.get("/", protect, getServices);

router.post("/", setService);

router.put("/:id", protect, updateServices);

module.exports = router;
