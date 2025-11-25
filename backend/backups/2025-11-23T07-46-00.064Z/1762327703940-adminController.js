const Report = require('../models/Report');
const sendNotification = require('../utils/sendNotification');

exports.getDepartmentReports = async (req, res) => {
  const department = req.user.department;
  const filter = department ? { department } : {};
  const reports = await Report.find(filter).populate('submitter', 'name email').sort('-createdAt');
  res.json(reports);
};

exports.updateReportStatus = async (req, res) => {
  const { status } = req.body;
  const report = await Report.findById(req.params.id).populate('submitter', 'email name');
  if (!report) return res.status(404).json({ msg: 'Report not found' });

  report.status = status;
  report.updatedAt = Date.now();
  await report.save();

  await sendNotification({ message: `Your report "${report.title}" is now ${status}`, targetRole: 'user' });

  res.json(report);
};

exports.analyticsSummary = async (req, res) => {
  const total = await Report.countDocuments();
  const byStatus = await Report.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const byCategory = await Report.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  res.json({ total, byStatus, byCategory });
};
