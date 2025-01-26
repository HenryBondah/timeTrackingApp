const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set up EJS for templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Middleware to add user to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Import routes
const authRoutes = require("./routes/auth");
const clockRoutes = require("./routes/clock");
const adminRoutes = require("./routes/admin");

// Use routes
app.use(authRoutes);
app.use(clockRoutes);
app.use(adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
