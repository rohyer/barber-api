const express = require("express");
const {
  getCustomerServices,
  setCustomerService
} = require("../controllers/customerServiceController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getCustomerServices);

router.post("/", protect, setCustomerService);

// router.put("/:id", );

// router.delete("/:id", );

module.exports = router;
