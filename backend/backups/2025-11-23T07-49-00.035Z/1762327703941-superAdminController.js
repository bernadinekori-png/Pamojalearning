const User = require('../models/User');
const sendNotification = require('../utils/sendNotification');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  user.role = role;
  await user.save();
  res.json(user);
};

exports.broadcast = async (req, res) => {
  const { message, targetRole = 'all' } = req.body;
  const n = await sendNotification({ message, targetRole });
  res.json(n);
};
