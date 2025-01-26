const express = require("express");
const { login, logout, renderLoginPage } = require("../controllers/authController");

const router = express.Router();

// Routes
router.get("/login", renderLoginPage); // Correct callback for rendering the login page
router.post("/login", login); // Callback for handling login submissions
router.get("/logout", logout); // Logout functionality

module.exports = router;
  