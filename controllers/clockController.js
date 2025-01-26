const { db } = require("../config/firebase");

exports.clockIn = async (req, res) => {
  const { userId } = req.session.user;

  try {
    await db.collection("time-logs").add({
      userId,
      clockIn: new Date().toISOString(),
      clockOut: null,
    });
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.editTime = async (req, res) => {
  const { logId, clockIn, clockOut } = req.body;

  try {
    await db.collection("time-logs").doc(logId).update({ clockIn, clockOut });
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
