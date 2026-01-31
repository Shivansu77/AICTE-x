import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SidebarHeader from '../components/approval/SidebarHeader';
import RequestListItem from '../components/approval/RequestListItem';

const ApprovalDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    // Initial List Fetch
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/requests/pending');
                setRequests(response.data);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Client-side quick score for list view (Mock/Hash based)
    const getQuickScore = (text = '') => Math.min(Math.floor(70 + (text.length % 30)), 99);
    const getReviewMinutes = (text = '') => Math.max(20, Math.min(90, Math.ceil(text.length / 40)));
    const avgScore = requests.length
        ? Math.round(requests.reduce((sum, r) => sum + getQuickScore(r.justification || ''), 0) / requests.length)
        : '--';
    const highRisk = requests.filter(r => getQuickScore(r.justification || '') < 70).length;
    const avgEtaMinutes = requests.length
        ? Math.round(requests.reduce((sum, r) => sum + getReviewMinutes(r.justification || ''), 0) / requests.length)
        : null;
    const avgEta = avgEtaMinutes ? `${avgEtaMinutes}m` : '--';

    const normalizedQuery = query.trim().toLowerCase();
    const filteredRequests = normalizedQuery
        ? requests.filter(r => {
            const courseTitle = r.curriculumId?.title || r.courseId?.title || '';
            const facultyName = r.facultyId?.firstName || '';
            return [r.requestType, courseTitle, r.justification, facultyName]
                .filter(Boolean)
                .some(value => String(value).toLowerCase().includes(normalizedQuery));
        })
        : requests;

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-secondary animate-pulse">Initializing AI Core...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-2rem)] bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-[2.5rem] border border-white shadow-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">AI Approvals</h1>
                    <p className="text-sm text-gray-500">Select a request to open the AI review workspace.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm font-bold text-gray-700">
                        Queue: {requests.length}
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white border border-gray-100 text-sm font-bold text-gray-700">
                        Avg Score: {avgScore}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                <aside className="space-y-4">
                    <SidebarHeader count={requests.length} avgScore={avgScore} highRisk={highRisk} avgEta={avgEta} />

                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <div className="text-xs font-black uppercase tracking-wider text-gray-400">Search Requests</div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by course, faculty, or keyword"
                            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </aside>

                <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-gray-900">Approval Queue</h2>
                        <span className="text-xs text-gray-400">Click a request to review</span>
                    </div>
                    <div className="space-y-3">
                        {filteredRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-secondary/50 font-bold">
                                <Check size={40} className="mb-2" />
                                {requests.length === 0 ? 'All Caught Up' : 'No matches found'}
                            </div>
                        ) : (
                            filteredRequests.map(req => {
                                const quickScore = getQuickScore(req.justification || '');
                                return (
                                    <RequestListItem
                                        key={req._id}
                                        request={req}
                                        isSelected={false}
                                        onSelect={() => navigate(`/admin/approvals/${req._id}`)}
                                        quickScore={quickScore}
                                    />
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ApprovalDashboard;
