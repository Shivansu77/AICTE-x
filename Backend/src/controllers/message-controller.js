const Message = require('../models/Message');
const User = require('../models/User');

// Get all messages for a specific channel
const getMessages = async (req, res) => {
    try {
        const { channel } = req.query;
        // Default to 'academic' if not specified, though frontend should always specify
        const filter = channel ? { channel } : {};

        const messages = await Message.find(filter)
            .populate('sender', 'firstName lastName role')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    try {
        const { content, role, senderId, channel } = req.body;

        if (!senderId || !content) {
            return res.status(400).json({ message: "Sender and Content are required" });
        }

        const newMessage = new Message({
            sender: senderId,
            content,
            role: role || 'Student',
            channel: channel || 'academic' // Default
        });

        await newMessage.save();

        // Populate sender details for immediate display return
        await newMessage.populate('sender', 'firstName lastName');

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        // Check for admin or owner
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Assuming req.user is populated by auth middleware (which should be added to the route)
        // If auth middleware isn't on this route yet, we might rely on client side (insecure) 
        // OR we check if the request body provides senderId (insecure).
        // Let's assume standard pattern: req.user.userId/role from verifyToken

        // For now, since verifyToken might not be on the route or I need to check routes/message-routes.js
        // I will just perform the deletion, but I SHOULD check for auth.
        // Let's look at message-routes.js first to see if auth middleware is there.

        // Check if user is admin or the sender
        const isAdmin = req.user.role === 'admin' || req.user.role === 'Admin';
        const isSender = message.sender.toString() === req.user.userId || message.sender.toString() === req.user.id;

        if (!isAdmin && !isSender) {
            return res.status(403).json({ message: "Not authorized to delete this message" });
        }

        await Message.findByIdAndDelete(id);
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    deleteMessage
};
