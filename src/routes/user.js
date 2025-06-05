const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    validateUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../controllers/authMiddleware');

// All endpoints for admin only
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.post('/', authenticate, authorize('admin'), validateUser, createUser);
router.put('/:id', authenticate, authorize('admin'), validateUser, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
