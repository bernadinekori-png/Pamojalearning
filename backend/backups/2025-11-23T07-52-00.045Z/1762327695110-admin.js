const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { getDepartmentReports, updateReportStatus, analyticsSummary } = require('../controllers/adminController');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/reports', getDepartmentReports);
router.patch('/reports/:id/status', updateReportStatus);
router.get('/analytics', analyticsSummary);

module.exports = router;
