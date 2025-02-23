const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { collection, getDocs, addDoc, updateDoc, doc } = require("firebase/firestore");

// ✅ Generate a test Ethereal SMTP account
const createTestAccount = async () => {
    return await nodemailer.createTestAccount();
};

const adminController = {
    // ✅ View all users and logs 
    viewUsers: async (req, res) => {
      try {
          // ✅ Fetch Users from Firestore
          const usersSnapshot = await getDocs(collection(db, "users"));
          const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // ✅ Fetch Logs from Firestore
          const logsSnapshot = await getDocs(collection(db, "time-logs"));
          const logs = logsSnapshot.docs.map(doc => ({
              id: doc.id,  // Ensure Firestore ID is included for updates
              ...doc.data()
          }));

          // ✅ Fetch Working Hours from Firestore
          const hoursSnapshot = await getDocs(collection(db, "working-hours"));
          const workingHours = hoursSnapshot.docs.map(doc => doc.data());

          console.log("✅ Users, logs, and working hours retrieved successfully.");
          
          // ✅ Pass `logs` & `workingHours` to EJS
          res.render("pages/adminDashboard", { users, logs, workingHours });
      } catch (error) {
          console.error("❌ Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data.", error });
      }
  },

  // ✅ Fix: Approve or Unapprove Time Logs
  toggleApproval: async (req, res) => {
      let { logId, status } = req.body;

      // Ensure logId is a valid string
      if (!logId || typeof logId !== "string") {
          console.error("❌ Error: Invalid Log ID:", logId);
          return res.status(400).json({ message: "Error: Invalid Log ID" });
      }

      try {
          console.log(`ℹ️ Received logId: ${logId}, current status: ${status}`);

          // Reference the Firestore document
          const logRef = doc(db, "time-logs", logId.trim()); // Trim in case of spaces

          // Toggle between "approved" and "pending"
          const newStatus = status === "approved" ? "pending" : "approved";
          await updateDoc(logRef, { status: newStatus });

          console.log(`✅ Log ${logId} updated to ${newStatus}`);
          res.status(200).json({ message: "Log status updated successfully." });
      } catch (error) {
          console.error("❌ Error updating log status:", error);
          res.status(500).json({ message: "Error updating log status.", error });
      }
  },


    // ✅ Render Add User Page
    renderAddUserPage: (req, res) => {
        res.render("pages/addUser", { success: null, error: null });
    },

    // ✅ Add a new user (Works with any email format)
    addUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.render("pages/addUser", { success: null, error: "Email and password are required." });
            }

            // ✅ Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            console.log(`ℹ️ Adding new user to Firestore: ${email}`);
            await addDoc(collection(db, "users"), {
                email,
                password: hashedPassword,
                role: "user",
                createdAt: new Date(),
            });

            console.log("✅ User successfully added to Firestore.");

            // ✅ Set up Ethereal for email testing (Fake SMTP)
            let testAccount = await createTestAccount();

            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            // ✅ Email Details
            const mailOptions = {
                from: `"TimeTracker" <no-reply@timetracker.com>`,
                to: email,
                subject: "Account Created",
                html: `<p>Your account has been created. <a href="http://localhost:3000/login">Login here</a></p>`,
            };

            // ✅ Send email
            const info = await transporter.sendMail(mailOptions);
            console.log(`📩 Email Sent! Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

            res.render("pages/addUser", { success: "User added successfully!", error: null });
        } catch (error) {
            console.error("❌ Error adding user:", error);
            res.render("pages/addUser", { success: null, error: "Error adding user. Please try again." });
        }
    },

    renderSetHoursPage: (req, res) => {
      res.render("pages/setHours", { success: null, error: null });
  },

  // ✅ Set Working Hours
  setHours: async (req, res) => {
      try {
          const { day, startHour, endHour } = req.body;
          await addDoc(collection(db, "working-hours"), { day, startHour, endHour });

          console.log(`✅ Working hours set: ${day} from ${startHour} to ${endHour}`);
          res.render("pages/setHours", { success: `Working hours for ${day} saved.`, error: null });
      } catch (error) {
          console.error("❌ Error setting working hours:", error);
          res.render("pages/setHours", { success: null, error: "Error setting working hours." });
      }
  },
};

module.exports = adminController;
