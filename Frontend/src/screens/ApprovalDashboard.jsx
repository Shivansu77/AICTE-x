import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import api from '../utils/api';
import SidebarHeader from '../components/approval/SidebarHeader';
import RequestListItem from '../components/approval/RequestListItem';
import ReviewHeader from '../components/approval/ReviewHeader';
import AIInsightCard from '../components/approval/AIInsightCard';
import DiffPanel from '../components/approval/DiffPanel';
import EmptyState from '../components/approval/EmptyState';

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
                <SidebarHeader count={requests.length} />

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
                            <RequestListItem
                                key={req._id}
                                request={req}
                                isSelected={selectedReq?._id === req._id}
                                onSelect={setSelectedReq}
                                quickScore={quickScore}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Main Content - Diff View */}
            <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-2xl shadow-blue-900/5 overflow-hidden relative">
                {selectedReq ? (
                    <>
                        {/* Header */}
                        <ReviewHeader
                            onReject={() => handleAction(selectedReq._id, 'rejected')}
                            onApprove={() => handleAction(selectedReq._id, 'approved')}
                        />

                        <div className="px-8 pt-6">
                            <AIInsightCard analyzing={analyzing} aiData={aiData} />
                        </div>

                        {/* Diff Content */}
                        <DiffPanel selectedReq={selectedReq} />
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default ApprovalDashboard;
