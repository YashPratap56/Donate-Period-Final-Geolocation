const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
