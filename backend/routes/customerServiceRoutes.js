const express = require("express");
const {
  getCustomerServices,
  setCustomerService,
  updateCustomerService,
  deleteCustomerService
} = require("../controllers/customerServiceController");
const { protect } = require("../middleware/authMiddleware");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");
const router = express.Router();

router.get("/", protect, cacheMiddleware, getCustomerServices);

router.post("/", protect, setCustomerService);

router.put("/:id", protect, updateCustomerService);

router.delete("/:id", protect, deleteCustomerService);

module.exports = router;
