const Notification = require('../models/NotificationModel');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
require("dotenv").config();



// Configure email transporter (e.g., using Gmail for simplicity)
// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Create a notification
exports.createNotification = async (user_id, message, type, sendMail) => {
    try {
        // Save notification to MongoDB
        const notification = new Notification({ user_id, message, type });
        await notification.save();

        const user = await mongoose.model('User').findById(user_id);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        if(sendMail){
            await transporter.sendMail({
                from: 'process.env.EMAIL_USER',
                to: user.email,
                subject: 'RideBuddy Notification',
                text: message,
            })
        }

    return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get unread notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const user_id = req.params.user_id; // Assuming user_id comes from route params
        const notifications = await Notification.find({ user_id, read: false }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );
        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};