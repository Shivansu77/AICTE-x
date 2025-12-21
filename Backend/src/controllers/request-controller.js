const fs = require('fs');
const path = require('path');
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
    const log = (msg) => {
        try {
            fs.appendFileSync(path.join(__dirname, '../../debug.log'), new Date().toISOString() + ' ' + msg + '\n');
        } catch (e) { console.error(e); }
    };

    log(`Start updateRequestStatus: ${req.params.id} Status: ${req.body.status}`);

    try {
        const { status, adminRemarks } = req.body;
        const request = await UpdateReq.findById(req.params.id);

        if (!request) {
            log('Request not found');
            return res.status(404).json({ message: 'Request not found' });
        }

        log(`Found Request: ${request._id}, Type: ${request.requestType}`);

        request.status = status;
        request.adminRemarks = adminRemarks;
        request.reviewedBy = req.user.userId;

        log(`Reviewer: ${req.user.userId}`);

        // If Approved, Trigger New Version Creation (Publishing)
        if (status === 'approved') {
            log('Status is approved. Fetching Curriculum: ' + request.curriculumId);
            const oldSubject = await Curriculum.findById(request.curriculumId);

            if (oldSubject) {
                log('Found oldSubject: ' + oldSubject._id);
                // Archive Old Version
                oldSubject.isLatest = false;
                oldSubject.status = 'archived';
                await oldSubject.save();

                // Prepare New Data
                const newSubjectData = { ...oldSubject.toObject() };
                delete newSubjectData._id;
                delete newSubjectData.createdAt;
                delete newSubjectData.updatedAt;

                newSubjectData.version = oldSubject.version + 1;
                newSubjectData.isLatest = true;
                newSubjectData.status = 'published';
                newSubjectData.publishedAt = new Date();
                newSubjectData.parentVersionId = oldSubject._id;
                newSubjectData.approvedBy = req.user.userId;
                newSubjectData.updateLog = `[${request.requestType}] ${request.justification}`;

                log('Prepared newSubjectData, applying changes...');

                // APPLY PROPOSED CHANGES
                const changes = request.proposedChanges || {};
                log('Changes: ' + JSON.stringify(changes));

                if (request.requestType === 'Update Content' && changes.description) {
                    newSubjectData.description = changes.description;
                }

                if (request.requestType === 'Add Topic' && changes.unitNumber && changes.newTopic) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        newSubjectData.units[unitIndex].topics.push(changes.newTopic);
                    }
                }

                if (request.requestType === 'Remove Topic' && changes.unitNumber && changes.newTopic) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        // Filter out the topic (exact match)
                        newSubjectData.units[unitIndex].topics = newSubjectData.units[unitIndex].topics.filter(t => t !== changes.newTopic);
                    }
                }

                if (request.requestType === 'Add Unit' && changes.unitNumber && changes.unitTitle) {
                    const existingIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (existingIndex === -1) {
                        newSubjectData.units.push({
                            title: changes.unitTitle,
                            unitNumber: parseInt(changes.unitNumber),
                            hours: parseInt(changes.unitHours) || 0,
                            topics: []
                        });
                        // Sort units by unitNumber to keep curriculum organized
                        newSubjectData.units.sort((a, b) => a.unitNumber - b.unitNumber);
                    }
                }

                if (request.requestType === 'Add Topic Detail' && changes.unitNumber && changes.newTopic && changes.description) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        const unit = newSubjectData.units[unitIndex];
                        // Initialize topicDetails map if it doesn't exist (it is a Map now)
                        if (!unit.topicDetails) {
                            unit.topicDetails = new Map();
                        }
                        // Mongoose Map needs .get / .set or treat as object if using lean/toObject()
                        // Since we used .toObject() above, it's a plain object or Map depending on mongoose version/options
                        // However, in standard JS object from Mongoose toObject(), Maps become objects usually.
                        // Let's assume it's an object for safety with the schema definition `type: Map`.
                        // Actually, `toObject()` defaults to converting Maps to Objects.
                        // So we can treat it as an object where keys are topics.

                        // Wait, if it's undefined in old data, we init it.
                        let details = unit.topicDetails[changes.newTopic] || [];
                        details.push(changes.description);
                        unit.topicDetails[changes.newTopic] = details;
                    }
                }

                if (request.requestType === 'Remove Topic Detail' && changes.unitNumber && changes.newTopic && changes.description) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        const unit = newSubjectData.units[unitIndex];
                        if (unit.topicDetails && unit.topicDetails[changes.newTopic]) {
                            unit.topicDetails[changes.newTopic] = unit.topicDetails[changes.newTopic].filter(d => d !== changes.description);
                        }
                    }
                }

                if (request.requestType === 'Update Unit' && changes.unitNumber) {
                    const unitIndex = newSubjectData.units.findIndex(u => u.unitNumber == changes.unitNumber);
                    if (unitIndex !== -1) {
                        if (changes.unitTitle) newSubjectData.units[unitIndex].title = changes.unitTitle;
                        if (changes.unitHours) newSubjectData.units[unitIndex].hours = parseInt(changes.unitHours);
                    }
                }

                log('Saving newSubject...');
                // Create and Save New Version
                const newSubject = new Curriculum(newSubjectData);
                await newSubject.save();
                log('Saved newSubject');
            } else {
                log('Old Subject Not Found');
            }
        }

        await request.save();
        log('Request saved');
        res.json(request);
    } catch (error) {
        log('Exception: ' + error.stack);
        console.error(error); // Log for debugging
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
