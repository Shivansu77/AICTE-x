const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement-controller');

// TODO: Add auth middleware to protect create route (Admin only ideally)
router.post('/', announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);

module.exports = router;
