const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const { collection, getDocs, query, where, limit } = require("firebase/firestore");

const authController = {
    // ✅ Render Register Page
    renderRegisterPage: (req, res) => {
        res.render("pages/register", { error: null });
    },

    // ✅ Register an Admin
    registerAdmin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await addDoc(collection(db, "users"), { email, password: hashedPassword, role: "admin", createdAt: new Date() });
            res.redirect("/login");
        } catch (error) {
            console.error("❌ Error registering admin:", error);
            res.render("pages/register", { error: "Error registering admin." });
        }
    },

    // ✅ Login function (Fix: Properly Compare Hashed Passwords)
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            console.log(`🔍 Attempting login for: ${email}`);

            // Query Firestore for the user
            const userQuery = query(collection(db, "users"), where("email", "==", email), limit(1));
            const userSnapshot = await getDocs(userQuery);

            if (userSnapshot.empty) {
                console.log("❌ User not found.");
                return res.render("pages/login", { error: "Invalid email or password" });
            }

            const user = userSnapshot.docs[0].data();
            console.log("✅ User retrieved from Firestore:", user);

            // ✅ Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.log("❌ Password mismatch.");
                return res.render("pages/login", { error: "Invalid email or password" });
            }

            // ✅ Save user session
            req.session.user = {
                email: user.email,
                role: user.role,
            };

            console.log("✅ Login successful.");
            res.redirect(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
        } catch (error) {
            console.error("❌ Login error:", error);
            res.render("pages/login", { error: "An error occurred during login." });
        }
    },

    // ✅ Logout function
    logout: (req, res) => {
        req.session.destroy(() => {
            console.log("ℹ️ User logged out.");
            res.redirect("/login");
        });
    },

    // ✅ Render Login Page
    renderLoginPage: (req, res) => {
        res.render("pages/login", { error: null });
    }
};

module.exports = authController;
