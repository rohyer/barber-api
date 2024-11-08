const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getServices, setService } = require("../controllers/serviceController");

router.get("/", protect, getServices);

router.post("/", setService);

module.exports = router;
