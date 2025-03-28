const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get unread notifications for a user
router.get('/:user_id', notificationController.getUserNotifications);

// Mark a notification as read
router.put('/read/:id', notificationController.markAsRead);

module.exports = router;