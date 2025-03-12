const express = require("express");
const { renderSetDemarcationPage, setClockInArea, getClockInArea } = require("../controllers/adminController");
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

// ✅ Route to Render the Set Demarcation Page
router.get("/set-demarcation", renderSetDemarcationPage);

// ✅ Route to Save Clock-In Area

router.post("/set-clockin-area", setClockInArea);

// ✅ Route to Fetch Saved Clock-In Area
router.get("/get-clockin-area", getClockInArea);

module.exports = router;
