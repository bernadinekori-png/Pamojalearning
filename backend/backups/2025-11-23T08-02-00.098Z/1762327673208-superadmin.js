const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { listUsers, updateUserRole, broadcast } = require('../controllers/superAdminController');

router.use(protect, authorize('superadmin'));
router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/broadcast', broadcast);

module.exports = router;
