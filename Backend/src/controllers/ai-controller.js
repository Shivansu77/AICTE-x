const aiService = require('../services/ai-service');

exports.analyzeSyllabus = async (req, res) => {
    try {
        const { justification, proposedChanges } = req.body;

        if (!justification) {
            return res.status(400).json({ message: "Justification is required." });
        }

        const result = await aiService.analyzeSyllabus(justification, proposedChanges);
        res.status(200).json(result);

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "AI Analysis failed" });
    }
};
