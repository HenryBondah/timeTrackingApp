// Hardcoded users
const users = [
    { email: "admin@example.com", password: "admin123", role: "admin" },
    { email: "user@example.com", password: "user123", role: "user" },
  ];
  
  // Login function
  exports.login = (req, res) => {
    const { email, password } = req.body;
  
    // Validate credentials
    const user = users.find((u) => u.email === email && u.password === password);
  
    if (!user) {
      return res.render("pages/login", { error: "Invalid email or password" });
    }
  
    // Save user session
    req.session.user = user;
    res.redirect(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
  };
  
  // Logout function
  exports.logout = (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  };
  
  // Render the login page (callback function for `GET /login`)
  exports.renderLoginPage = (req, res) => {
    res.render("pages/login", { error: null });
  };
  