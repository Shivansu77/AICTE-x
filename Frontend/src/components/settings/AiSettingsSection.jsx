import React, { useState, useEffect } from 'react';
import { Bot, Key, Settings, Check, AlertCircle, Loader, Eye, EyeOff, Zap } from 'lucide-react';
import api from '../../utils/api';

const AiSettingsSection = () => {
    const [config, setConfig] = useState({
        hasApiKey: false,
        apiKeyMasked: '',
        model: 'gemini-1.5-flash',
        availableModels: []
    });
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data } = await api.get('/settings/ai-config');
            setConfig(data);
            setSelectedModel(data.model);
        } catch (error) {
            console.error('Failed to fetch AI config:', error);
            setMessage({ type: 'error', text: 'Failed to load AI configuration' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {};
            if (apiKey) payload.apiKey = apiKey;
            if (selectedModel !== config.model) payload.model = selectedModel;

            await api.put('/settings/ai-config', payload);
            setMessage({ type: 'success', text: 'AI configuration saved successfully!' });
            setApiKey(''); // Clear input after save
            fetchConfig(); // Refresh config
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save configuration' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.post('/settings/ai-config/test');
            setMessage({ type: 'success', text: `✓ ${data.message} (Model: ${data.model})` });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Connection test failed' });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-[#1f2937] rounded-2xl p-8 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={24} />
                <span className="ml-3 text-gray-600 dark:text-gray-300">Loading AI settings...</span>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1f2937] rounded-2xl p-8 border border-gray-100 dark:border-gray-700 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Configuration</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Configure Gemini AI for curriculum analysis</p>
                </div>
            </div>

            {/* Status Indicator */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${config.hasApiKey ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
                {config.hasApiKey ? (
                    <>
                        <Check className="text-green-600 dark:text-green-400" size={20} />
                        <span className="text-green-700 dark:text-green-300 font-medium">API Key configured: {config.apiKeyMasked}</span>
                    </>
                ) : (
                    <>
                        <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                        <span className="text-yellow-700 dark:text-yellow-300 font-medium">No API key configured. AI features are disabled.</span>
                    </>
                )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Key className="inline-block mr-2" size={16} />
                    Gemini API Key
                </label>
                <div className="relative">
                    <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={config.hasApiKey ? 'Enter new API key to update...' : 'Enter your Gemini API key...'}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl font-mono text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
                </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Settings className="inline-block mr-2" size={16} />
                    AI Model
                </label>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                    {config.availableModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recommended: gemini-1.5-flash for fast analysis, gemini-1.5-pro for detailed analysis
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={saving || (!apiKey && selectedModel === config.model)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                >
                    {saving ? <Loader className="animate-spin" size={18} /> : <Check size={18} />}
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>

                <button
                    onClick={handleTest}
                    disabled={testing || !config.hasApiKey}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                >
                    {testing ? <Loader className="animate-spin" size={18} /> : <Zap size={18} />}
                    {testing ? 'Testing...' : 'Test Connection'}
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AiSettingsSection;
