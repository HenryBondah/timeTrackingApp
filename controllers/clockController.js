const { db } = require("../config/firebase");
const { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } = require("firebase/firestore");

// Function to calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}

const isWithinRange = async (latitude, longitude) => {
    try {
        const snapshot = await getDocs(collection(db, "clock-in-area"));
        if (snapshot.empty) {
            console.warn("⚠️ No clock-in area set.");
            return "Unknown"; // If no area is set, return "Unknown"
        }

        const area = snapshot.docs[0].data();
        const distance = getDistance(latitude, longitude, area.latitude, area.longitude);
        console.log(`📍 Distance: ${distance} meters (Allowed: ${area.radius}m)`);
        
        return distance <= area.radius ? "Yes" : "No";
    } catch (error) {
        console.error("❌ Error checking range:", error);
        return "Unknown";
    }
};

const clockController = {
    // ✅ Fetch Logs and Pass to Dashboard
    getUserLogs: async (req, res) => {
        if (!req.session.user) return res.redirect("/login");

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
    },

     // ✅ Fetch Logs and Pass to Dashboard
     getUserLogs: async (req, res) => {
        if (!req.session.user) {
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

    // ✅ Clock In with Location Check
    clockIn: async (req, res) => {
        const { email } = req.session.user;
        const { latitude, longitude } = req.body;
    
        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location required for clock-in." });
        }
    
        const withinRange = await isWithinRange(latitude, longitude);
    
        try {
            const logRef = await addDoc(collection(db, "time-logs"), {
                userId: email,
                clockIn: new Date().toISOString(),
                clockInLat: latitude,
                clockInLng: longitude,
                withinRange: withinRange ? "Yes" : "No",
                clockOut: null,
                status: "pending"
            });
    
            console.log(`✅ Clock In saved for ${email} at ${latitude}, ${longitude}`);
            res.redirect("/dashboard");
        } catch (error) {
            console.error("❌ Error during clock-in:", error);
            res.status(500).send({ message: "Error during clock-in.", error });
        }
        },

    // ✅ Clock Out
    clockOut: async (req, res) => {
        const { email } = req.session.user;
        const { latitude, longitude } = req.body;
    
        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Location required for clock-out." });
        }
    
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
    
            await updateDoc(logRef, {
                clockOut: new Date().toISOString(),
                clockOutLat: latitude,
                clockOutLng: longitude
            });
    
            console.log(`✅ Clock Out updated for ${email} at ${latitude}, ${longitude}`);
            res.redirect("/dashboard");
        } catch (error) {
            console.error("❌ Error during clock-out:", error);
            res.status(500).send({ message: "Error during clock-out.", error });
        }
        },

    isWithinRange: async (req, res) => {
        const clockInCollection = collection(db, "clock-in-area");
        const snapshot = await getDocs(clockInCollection);
    
        if (snapshot.empty) return false;
    
        const { latitude: centerLat, longitude: centerLng, radius } = snapshot.docs[0].data();
    
        // Haversine formula to calculate distance
        const toRad = (value) => (value * Math.PI) / 180;
        const earthRadius = 6371000; // meters
    
        const dLat = toRad(latitude - centerLat);
        const dLon = toRad(longitude - centerLng);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(centerLat)) * Math.cos(toRad(latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
    
        return distance <= radius;
    },
};

module.exports = clockController;
