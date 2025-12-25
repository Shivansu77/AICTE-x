import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Activity, Zap, GitPullRequest, Shield } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [selectedReq, setSelectedReq] = useState(null);
    const [loading, setLoading] = useState(true);

    // AI Analysis State
    const [aiData, setAiData] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    // Initial List Fetch
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/requests/pending');
                setRequests(response.data);
                if (response.data.length > 0) setSelectedReq(response.data[0]);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Fetch AI Analysis when selection changes
    useEffect(() => {
        const analyzeCurrentReq = async () => {
            if (!selectedReq) return;

            setAnalyzing(true);
            setAiData(null); // Reset previous data

            try {
                const response = await api.post('/ai/analyze-syllabus', {
                    justification: selectedReq.justification,
                    proposedChanges: selectedReq.proposedChanges
                });
                setAiData(response.data);
            } catch (error) {
                console.error("AI Analysis failed", error);
                setAiData({ score: 0, reason: "Analysis failed. Please try again." });
            } finally {
                setAnalyzing(false);
            }
        };

        analyzeCurrentReq();
    }, [selectedReq]);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/requests/${id}/status`, { status });
            // Optimistic update
            setRequests(prev => prev.filter(r => r._id !== id));
            if (selectedReq?._id === id) {
                const nextReq = requests.find(r => r._id !== id);
                setSelectedReq(nextReq || null);
            }
        } catch (error) {
            console.error(error);
            alert("Action failed. Please try again.");
        }
    };

    // Client-side quick score for list view (Mock/Hash based)
    const getQuickScore = (text) => Math.min(Math.floor(70 + (text.length % 30)), 99);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-secondary animate-pulse">Initializing AI Core...</p>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 max-w-7xl mx-auto px-4 overflow-hidden">
            {/* Sidebar - Request List */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-xl shadow-blue-900/5">
                    <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                        <Shield className="text-accent-blue" /> Pending Approvals
                    </h2>
                    <p className="text-secondary font-medium text-sm mt-1">
                        {requests.length} changes awaiting AI verification
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                    {requests.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 text-secondary/50 font-bold">
                            <Check size={48} className="mb-2" />
                            All Caught Up
                        </div>
                    )}
                    {requests.map(req => {
                        const quickScore = getQuickScore(req.justification);
                        return (
                            <motion.div
                                layoutId={req._id}
                                key={req._id}
                                onClick={() => setSelectedReq(req)}
                                className={`p-5 rounded-[1.5rem] cursor-pointer border-2 transition-all relative overflow-hidden group ${selectedReq?._id === req._id
                                    ? 'bg-white border-accent-blue shadow-lg scale-[1.02]'
                                    : 'bg-white/50 border-transparent hover:bg-white hover:border-gray-100'
                                    }`}
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GitPullRequest size={64} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-secondary">{req.requestType}</span>
                                        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${quickScore > 85 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                            <Zap size={10} fill="currentColor" /> {quickScore}% PRE-SCAN
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-primary leading-tight mb-1 line-clamp-2">{req.justification}</h4>
                                    <p className="text-xs text-secondary font-medium">Requested by Faculty</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content - Diff View */}
            <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-2xl shadow-blue-900/5 overflow-hidden relative">
                {selectedReq ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 bg-white/50">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-black text-primary mb-2">Review Changes</h1>
                                    <div className="flex items-center gap-2 text-secondary font-medium text-sm">
                                        <Activity size={16} /> Impact Analysis: High Relevance
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(selectedReq._id, 'rejected')}
                                        className="px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedReq._id, 'approved')}
                                        className="px-8 py-3 rounded-xl bg-accent-blue text-white font-bold shadow-lg shadow-accent-blue/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <Check size={18} /> Approve Merge
                                    </button>
                                </div>
                            </div>

                            {/* AI Insight Card */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4 min-h-[100px] transition-all">
                                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-blue shadow-sm ${analyzing ? 'animate-pulse' : ''}`}>
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-primary">AI Compliance Check</h4>
                                    {analyzing ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm text-secondary font-medium">Analyzing with Gemini AI...</span>
                                        </div>
                                    ) : aiData ? (
                                        <>
                                            <p className="text-sm text-secondary font-medium mt-1">
                                                {aiData.reason}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Confidence Score:</span>
                                                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${aiData.score}%` }}
                                                        className={`h-full ${aiData.score > 80 ? 'bg-emerald-500' : aiData.score > 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                    />
                                                </div>
                                                <span className="font-black text-primary">{aiData.score}/100</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-secondary">Detailed analysis unavailable.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Diff Content */}
                        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-8 font-mono text-sm">
                            <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 relative">
                                <div className="absolute top-4 right-4 text-xs font-black text-red-300 uppercase tracking-widest">Original</div>
                                <h5 className="font-bold text-red-900 mb-4 opacity-50">Current Curriculum</h5>
                                <div className="space-y-2 opacity-60">
                                    <p>... (Existing content would appear here)</p>
                                    <p>Standard react hooks and lifecycle methods.</p>
                                    <div className="h-2 w-full bg-red-200/20 rounded"></div>
                                    <div className="h-2 w-2/3 bg-red-200/20 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 relative">
                                <div className="absolute top-4 right-4 text-xs font-black text-emerald-600 uppercase tracking-widest">Proposed</div>
                                <h5 className="font-bold text-emerald-900 mb-4">Incoming Changes</h5>
                                <div className="space-y-4">
                                    <div className="p-3 bg-emerald-100/50 rounded-lg text-emerald-800 border-l-4 border-emerald-500">
                                        <span className="font-bold block mb-1">+ New Topic Added</span>
                                        {typeof selectedReq.proposedChanges === 'string'
                                            ? selectedReq.proposedChanges
                                            : JSON.stringify(selectedReq.proposedChanges, null, 2)}
                                    </div>
                                    <div className="text-emerald-700/70 italic">
                                        "Industry Reference: {selectedReq.industryReference || 'Standard Update'}"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-secondary/40">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <GitPullRequest size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Select a Request</h3>
                        <p className="font-medium">Review pending changes from the sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovalDashboard;
