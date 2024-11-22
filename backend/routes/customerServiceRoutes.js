const express = require("express");
const {
  getCustomerServices,
  setCustomerService,
  updateCustomerService
} = require("../controllers/customerServiceController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getCustomerServices);

router.post("/", protect, setCustomerService);

router.put("/:id", protect, updateCustomerService);

// router.delete("/:id", );

module.exports = router;
