const express = require("express");
const { renderRegisterPage, registerAdmin, login, logout, renderLoginPage } = require("../controllers/authController");

const router = express.Router();

// ✅ Authentication Routes
router.get("/login", renderLoginPage);
router.post("/login", login);
router.get("/register", renderRegisterPage);
router.post("/register", registerAdmin);
router.get("/logout", logout);

module.exports = router;
