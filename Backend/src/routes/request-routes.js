const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request-controller');
const auth = require('../middleware/AuthMiddleware');

router.post('/', auth, requestController.createRequest);
router.get('/pending', auth, requestController.getPendingRequests);
router.get('/my-requests', auth, requestController.getMyRequests);
router.put('/:id/status', auth, requestController.updateRequestStatus);

module.exports = router;
