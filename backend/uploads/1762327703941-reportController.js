const Report = require('../models/Report');
const sendNotification = require('../utils/sendNotification');

exports.createReport = async (req, res) => {
  const { title, description, category } = req.body;
  const attachments = (req.files || []).map(f => '/uploads/' + f.filename);
  try {
    const report = await Report.create({
      title, description, category,
      attachments, submitter: req.user._id, department: req.user.department
    });
    await sendNotification({ message: `New report submitted: ${title}`, targetRole: 'admin' });
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyReports = async (req, res) => {
  const reports = await Report.find({ submitter: req.user._id }).sort('-createdAt');
  res.json(reports);
};

exports.getReport = async (req, res) => {
  const report = await Report.findById(req.params.id).populate('submitter', 'name email');
  if (!report) return res.status(404).json({ msg: 'Report not found' });
  res.json(report);
};

exports.addComment = async (req, res) => {
  const { message } = req.body;
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ msg: 'Report not found' });
  report.comments.push({ commenter: req.user._id, message });
  report.updatedAt = Date.now();
  await report.save();
  res.json(report);
};
