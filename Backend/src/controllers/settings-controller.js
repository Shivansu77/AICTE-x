const Settings = require('../models/Settings');
const aiService = require('../services/ai-service');

// Get AI configuration (admin only)
exports.getAiConfig = async (req, res) => {
    try {
        const apiKey = await Settings.getSetting('gemini_api_key', '');
        const model = await Settings.getSetting('gemini_model', 'gemini-1.5-flash');
        
        res.json({
            hasApiKey: !!apiKey,
            apiKeyMasked: apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : '',
            model,
            availableModels: [
                'gemini-2.5-flash',
                'gemini-1.5-pro',
                'gemini-pro',
                'gemini-1.0-pro'
            ]
        });
    } catch (error) {
        console.error('Get AI config error:', error);
        res.status(500).json({ message: 'Failed to fetch AI configuration' });
    }
};

// Update AI configuration (admin only)
exports.updateAiConfig = async (req, res) => {
    try {
        const { apiKey, model } = req.body;
        
        if (apiKey) {
            await Settings.setSetting('gemini_api_key', apiKey, req.user._id, 'Gemini API Key');
            aiService.setApiKey(apiKey);
        }
        
        if (model) {
            await Settings.setSetting('gemini_model', model, req.user._id, 'Gemini Model');
            aiService.setModel(model);
        }
        
        res.json({ message: 'AI configuration updated successfully' });
    } catch (error) {
        console.error('Update AI config error:', error);
        res.status(500).json({ message: 'Failed to update AI configuration' });
    }
};

// Test AI connection
exports.testAiConnection = async (req, res) => {
    try {
        const config = aiService.getConfig();
        
        if (!config.hasApiKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'No API key configured' 
            });
        }
        
        // Simple test - just check if we can initialize
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const apiKey = await Settings.getSetting('gemini_api_key', process.env.GEMINI_API_KEY);
        
        if (!apiKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'No API key found' 
            });
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: config.model });
        
        // Quick test prompt
        const result = await model.generateContent('Say "API Connected Successfully" in exactly those words.');
        const response = await result.response;
        
        res.json({ 
            success: true, 
            message: 'AI connection successful',
            model: config.model,
            response: response.text().trim()
        });
    } catch (error) {
        console.error('Test AI connection error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Failed to connect to AI service'
        });
    }
};

// Initialize AI settings on server start
exports.initializeAiSettings = async () => {
    try {
        const apiKey = await Settings.getSetting('gemini_api_key');
        const model = await Settings.getSetting('gemini_model');
        
        if (apiKey) {
            aiService.setApiKey(apiKey);
            console.log('[Settings] Loaded API key from database');
        }
        
        if (model) {
            aiService.setModel(model);
            console.log(`[Settings] Using model: ${model}`);
        }
    } catch (error) {
        console.error('[Settings] Failed to initialize AI settings:', error.message);
    }
};
