const Announcement = require('../models/Announcement');

// Create a new announcement
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type } = req.body;

        const newAnnouncement = new Announcement({
            title,
            content,
            type: type || 'info',
            createdBy: req.user ? req.user.userId : null // Assuming auth middleware sets req.user
        });

        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all active announcements
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .sort({ createdAt: -1 }); // Newest first
        res.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements
};
