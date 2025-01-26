const { db } = require("../config/firebase");
const nodemailer = require("nodemailer");

// Add a new user (send invite email)
exports.addUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Send invitation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account Setup Invitation",
      html: `<p>Please <a href="${process.env.BASE_URL}/set-password?email=${email}">click here</a> to set up your account.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.render("pages/addUser", { success: "Invitation sent successfully." });
  } catch (error) {
    res.render("pages/addUser", { error: "Error sending email." });
  }
}; 

// View all users and logs
exports.viewUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const logsSnapshot = await db.collection("time-logs").get();
    const logs = logsSnapshot.docs.map((doc) => doc.data());

    res.render("pages/adminDashboard", { users, logs });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
