const { db } = require("../config/firebase");
const { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } = require("firebase/firestore");

const clockController = {
    // ✅ Fetch Logs and Pass to Dashboard
    getUserLogs: async (req, res) => {
        if (!req.session.user) {
            console.log("⚠️ User is not logged in. Redirecting to login...");
            return res.redirect("/login");
        }

        const { email } = req.session.user;

        try {
            const logsQuery = query(collection(db, "time-logs"), where("userId", "==", email));
            const logsSnapshot = await getDocs(logsQuery);
            const logs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.render("pages/dashboard", { user: req.session.user, logs });
        } catch (error) {
            console.error("❌ Error fetching logs:", error);
            res.render("pages/dashboard", { user: req.session.user, logs: [] });
        }
    },

    // ✅ Clock In
    clockIn: async (req, res) => {
        const { email } = req.session.user;

        try {
            const logRef = await addDoc(collection(db, "time-logs"), {
                userId: email,
                clockIn: new Date().toISOString(),
                clockOut: null,
                status: "pending"
            });

            console.log(`✅ Clock In saved for ${email}: ${logRef.id}`);
            res.redirect("/dashboard");
        } catch (error) {
            console.error("❌ Error during clock-in:", error);
            res.status(500).send({ message: "Error during clock-in.", error });
        }
    },

    // ✅ Clock Out
    clockOut: async (req, res) => {
        const { email } = req.session.user;

        try {
            const logsQuery = query(
                collection(db, "time-logs"),
                where("userId", "==", email),
                where("clockOut", "==", null)
            );
            const logsSnapshot = await getDocs(logsQuery);

            if (logsSnapshot.empty) {
                console.log(`⚠️ No active clock-in entry found for ${email}`);
                return res.redirect("/dashboard");
            }

            const logDoc = logsSnapshot.docs[0];
            const logRef = doc(db, "time-logs", logDoc.id);
            await updateDoc(logRef, { clockOut: new Date().toISOString() });

            console.log(`✅ Clock Out updated for ${email}: ${logDoc.id}`);
            res.redirect("/dashboard");
        } catch (error) {
            console.error("❌ Error during clock-out:", error);
            res.status(500).send({ message: "Error during clock-out.", error });
        }
    },

    // ✅ Edit Time Logs
    editTime: async (req, res) => {
        const { logId, clockIn, clockOut } = req.body;

        try {
            console.log(`ℹ️ Updating time log ${logId}...`);
            const logRef = doc(db, "time-logs", logId);
            await updateDoc(logRef, { clockIn, clockOut });
            console.log("✅ Time log updated successfully.");
            res.json({ message: "Time log updated successfully." });
        } catch (error) {
            console.error("❌ Error updating time log:", error);
            res.status(500).json({ message: "Error updating time log.", error });
        }
    },

    manualLog: async (req, res) => {
        const { userId, clockIn, clockOut } = req.body;
    
        try {
            if (!userId || !clockIn || !clockOut) {
                return res.status(400).json({ message: "Missing required fields." });
            }
    
            await addDoc(collection(db, "time-logs"), {
                userId,
                clockIn,
                clockOut,
                status: "pending",
            });
    
            console.log(`✅ Manual log added for ${userId}`);
            res.status(200).json({ message: "Manual time log added successfully." });
        } catch (error) {
            console.error("❌ Error saving manual entry:", error);
            res.status(500).json({ message: "Error saving manual entry.", error });
        }
    },
    

    // ✅ Delete Time Log
    deleteTime: async (req, res) => {
        const { logId } = req.body;

        try {
            console.log(`🗑️ Deleting time log ${logId}...`);
            await deleteDoc(doc(db, "time-logs", logId));
            console.log("✅ Time log deleted successfully.");
            res.json({ message: "Time log deleted successfully." });
        } catch (error) {
            console.error("❌ Error deleting time log:", error);
            res.status(500).json({ message: "Error deleting time log.", error });
        }
    }
};

module.exports = clockController;
