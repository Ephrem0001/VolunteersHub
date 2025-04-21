const Notification = require("../models/Notification");

router.post("/join", async (req, res) => {
  try {
    const notification = new Notification({
      user: req.body.user,
      event: req.body.event,
      message: `You have joined ${req.body.eventName}`,
    });
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
