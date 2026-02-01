const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message-controller');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.delete('/:id', authMiddleware, messageController.deleteMessage);

module.exports = router;
