const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getServices,
  setService,
  updateService
} = require("../controllers/serviceController");

router.get("/", protect, getServices);

router.post("/", setService);

router.put("/:id", protect, updateService);

module.exports = router;
