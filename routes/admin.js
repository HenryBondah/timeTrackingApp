const express = require("express");
const router = express.Router();

// Mock time logs (replace this with a real database later)
const logs = [
  { userId: "user@example.com", clockIn: "2025-01-25T08:00", clockOut: "2025-01-25T17:00" },
  { userId: "user2@example.com", clockIn: "2025-01-26T09:00", clockOut: null },
];

// Admin Dashboard Route
router.get("/admin-dashboard", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  res.render("pages/adminDashboard", { user: req.session.user, logs });
});

// Set Working Hours Route
router.get("/set-hours", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login");
  }
  res.render("pages/setHours", { user: req.session.user });
});

module.exports = router;
