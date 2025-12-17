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

module.exports = {
    getMessages,
    sendMessage
};
