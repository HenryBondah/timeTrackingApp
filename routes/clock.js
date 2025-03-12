const express = require("express");
const { clockIn, clockOut, getUserLogs, editTime, deleteTime, manualLog } = require("../controllers/clockController");
const { db } = require("../config/firebase");
const { collection, query, where, getDocs } = require("firebase/firestore");

const router = express.Router();

// ✅ Middleware to Protect Routes (Ensures User is Logged In)
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        console.log("⚠️ Access Denied: User Not Logged In");
        return res.redirect("/login");
    }
    next();
};

// ✅ User Dashboard (Fetch Logs and Pass to EJS)
router.get("/dashboard", requireLogin, getUserLogs);

// ✅ Edit Time Page (Ensure Logs are Passed to Edit Page)
router.get("/edit-time", requireLogin, async (req, res) => {
    const { email } = req.session.user;

    try {
        const logsQuery = query(collection(db, "time-logs"), where("userId", "==", email));
        const logsSnapshot = await getDocs(logsQuery);
        const logs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.render("pages/editTime", { user: req.session.user, logs });
    } catch (error) {
        console.error("❌ Error fetching logs:", error);
        res.render("pages/editTime", { user: req.session.user, logs: [] });
    }
});

// ✅ Clock In & Clock Out Routes
router.post("/clock-in", requireLogin, async (req, res) => {
    const { latitude, longitude } = req.body;
    req.body.latitude = latitude;
    req.body.longitude = longitude;
    await clockIn(req, res);
});

router.post("/clock-out", requireLogin, clockOut);

// ✅ Edit & Delete Time Logs
router.post("/edit-time", requireLogin, editTime);
router.post("/delete-time", requireLogin, deleteTime);
router.post("/manual-log", requireLogin, manualLog);


module.exports = router;
