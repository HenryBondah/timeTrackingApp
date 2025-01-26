const express = require("express");
const router = express.Router();

// Mock time logs (replace this with a real database later)
const logs = [
  { userId: "user@example.com", clockIn: "2025-01-25T08:00", clockOut: "2025-01-25T17:00", status: "approved" },
  { userId: "user@example.com", clockIn: "2025-01-26T09:00", clockOut: "2025-01-26T18:00", status: "pending" },
];

// Dashboard Route
router.get("/dashboard", (req, res) => {
  if (!req.session.user || req.session.user.role !== "user") {
    return res.redirect("/login");
  }
  const userLogs = logs.filter((log) => log.userId === req.session.user.email);
  res.render("pages/dashboard", { user: req.session.user, logs: userLogs });
});

// Edit-Time Route
router.get("/edit-time", (req, res) => {
  if (!req.session.user || req.session.user.role !== "user") {
    return res.redirect("/login");
  }
  const userLogs = logs.filter((log) => log.userId === req.session.user.email);
  res.render("pages/editTime", { user: req.session.user, logs: userLogs });
});

module.exports = router;
