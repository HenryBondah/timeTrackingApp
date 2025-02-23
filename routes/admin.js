const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

// ✅ Admin Dashboard
router.get("/admin-dashboard", adminController.viewUsers);

// ✅ Add User
router.get("/add-user", adminController.renderAddUserPage);
router.post("/add-user", adminController.addUser);

// ✅ Set Working Hours (Fixed)
router.get("/set-hours", adminController.renderSetHoursPage); // ✅ ADDED THIS
router.post("/set-hours", adminController.setHours);

// ✅ Approve/Unapprove Time Logs
router.post("/toggle-approval", adminController.toggleApproval);

module.exports = router;
