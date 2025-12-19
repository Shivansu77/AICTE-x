const UpdateReq = require('../models/UpdateReq');
const Curriculum = require('../models/Curriculum');
const Course = require('../models/Course');

exports.createRequest = async (req, res) => {
    try {
        const { courseId, curriculumId, requestType, justification, industryReference, proposedChanges } = req.body;

        const newReq = new UpdateReq({
            courseId,
            curriculumId,
            facultyId: req.user.userId,
            requestType,
            justification,
            industryReference,
            proposedChanges
        });

        await newReq.save();
        res.status(201).json(newReq);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await UpdateReq.find({ status: 'pending' })
            .populate('courseId', 'title code')
            .populate('curriculumId', 'title code')
            .populate('facultyId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;
        const request = await UpdateReq.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        request.adminRemarks = adminRemarks;
        request.reviewedBy = req.user.userId;

        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await UpdateReq.find({ facultyId: req.user.userId })
            .populate('courseId', 'title code')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
