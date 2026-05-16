/**
 * SECTION: User routes (admin) — mounted at /api/users
 * All routes require admin role.
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllUsers, getUser, updateUserRole, toggleBlockUser, deleteUser } = require('../controllers/userController');

router.use(protect, authorize('admin'));

// ─── Admin: list, view, role, block, delete ───
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).delete(deleteUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/block', toggleBlockUser);

module.exports = router;
