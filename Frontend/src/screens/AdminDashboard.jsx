import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, AlertCircle, Users, BookOpen } from 'lucide-react';

const StatCard = ({ title, value, color, icon: Icon, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${onClick ? 'hover:scale-[1.02]' : ''}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-secondary font-bold text-sm uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-extrabold text-primary">{value}</p>
        </div>
    </div>
);

const RequestItem = ({ title, requestedBy, type, date }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow font-bold">
                {type === 'New' ? 'N' : 'U'}
            </div>
            <div>
                <h4 className="font-bold text-primary">{title}</h4>
                <p className="text-xs text-secondary font-medium">By {requestedBy} • {date}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Approve">
                <CheckCircle size={18} />
            </button>
            <button className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Reject">
                <XCircle size={18} />
            </button>
            <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors" title="View Details">
                <FileText size={18} />
            </button>
        </div>
    </div>
);

import api from '../utils/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ courses: 0, faculty: 0, pending: 0 }); // Placeholder for now
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Data in Parallel
                const [reqRes, courseRes, facultyRes] = await Promise.all([
                    api.get('/api/requests/pending'),
                    api.get('/api/courses'),
                    api.get('/user/teachers')
                ]);

                setRequests(reqRes.data);

                setStats({
                    courses: courseRes.data.length,
                    faculty: facultyRes.data.length,
                    pending: reqRes.data.length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ... rest of component ...
    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Courses"
                    value={loading ? "..." : stats.courses}
                    color="bg-accent-blue"
                    icon={BookOpen}
                    onClick={() => navigate('/admin/courses')}
                />
                <StatCard title="Active Faculty" value={loading ? "..." : stats.faculty} color="bg-accent-peach" icon={Users} />
                <StatCard title="Pending Requests" value={loading ? "..." : stats.pending} color="bg-accent-yellow" icon={AlertCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Approvals */}
                <div className="bg-white/50 p-6 rounded-[2.5rem] border-2 border-white min-h-[400px]">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-2xl font-extrabold text-primary">Pending Approvals</h3>
                        <button className="text-accent-blue font-bold text-sm hover:underline">View All</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Loading Requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-600">All Caught Up!</h4>
                            <p className="text-gray-400 text-sm">No pending curriculum updates.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map(req => (
                                <RequestItem
                                    key={req._id}
                                    title={`${req.requestType}: ${req.curriculumId?.title || 'Unknown Subject'}`}
                                    requestedBy={`Prof. ${req.facultyId?.firstName || 'Faculty'}`}
                                    type={req.requestType === 'Add Topic' ? 'New' : 'Update'}
                                    date={new Date(req.createdAt).toLocaleDateString()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* System Activity Placeholder... */}
                {/* ... keep existing code ... */}


                {/* System Activity / Recent Actions (Placeholder) */}
                <div className="bg-accent-blue/5 p-6 rounded-[2.5rem] border-2 border-white flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-accent-blue shadow-sm mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">System Reports</h3>
                    <p className="text-secondary max-w-xs mb-6">Generate detailed compliance reports for AICTE monitoring.</p>
                    <button className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all">
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
