const Notification = require('../models/Notification');

const sendNotification = async ({ message, targetRole = 'all' }) => {
  const n = await Notification.create({ message, targetRole });
  return n;
};

module.exports = sendNotification;
