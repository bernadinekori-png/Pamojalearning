const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { protect } = require('../middleware/auth');
const { createReport, getMyReports, getReport, addComment } = require('../controllers/reportController');

router.post('/', protect, upload.array('attachments', 5), createReport);
router.get('/me', protect, getMyReports);
router.get('/:id', protect, getReport);
router.post('/:id/comment', protect, addComment);

module.exports = router;
