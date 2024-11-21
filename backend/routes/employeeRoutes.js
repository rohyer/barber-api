const express = require("express");
const router = express.Router();
const {
  getEmployees,
  setEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getEmployees);

router.post("/", protect, setEmployee);

router.put("/:id", protect, updateEmployee);

router.delete("/:id", protect, deleteEmployee);

module.exports = router;
