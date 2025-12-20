import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, Bell, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-secondary font-bold text-xs uppercase tracking-wider mb-1">{label}</h3>
            <p className="text-3xl font-black text-gray-800">{value}</p>
        </div>
    </div>
);

const NotificationItem = ({ request }) => {
    const [expanded, setExpanded] = useState(false);

    // Determine status color and label
    const isPending = request.status === 'pending';
    const isApproved = request.status === 'approved';
    const colorClass = isPending ? 'bg-red-500' : (isApproved ? 'bg-blue-500' : 'bg-gray-400');
    const title = `Request ${request.status}: ${request.courseId?.code || 'Course'}`;
    const date = new Date(request.createdAt).toLocaleDateString();

    return (
        <div className="border-b border-gray-50 last:border-0 transition-all duration-300">
            <div
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group select-none"
            >
                <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                        {title}
                    </h4>
                    <span className="text-xs text-gray-400 font-medium">{date}</span>
                </div>
                <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Accordion Content */}
            {expanded && (
                <div className="px-10 pb-4 text-xs text-gray-500 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p><span className="font-semibold text-gray-700">Type:</span> {request.requestType}</p>
                    {request.justification && (
                        <p className="leading-relaxed"><span className="font-semibold text-gray-700">Reason:</span> {request.justification}</p>
                    )}
                    {request.reviewComments && (
                        <div className="bg-gray-50 p-3 rounded-xl mt-2 italic text-gray-600 border border-gray-100 shadow-sm relative">
                            <span className="absolute top-2 left-2 text-2xl text-gray-200 leading-none">"</span>
                            <span className="relative z-10 pl-2">{request.reviewComments}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        myCourses: 0,
        pendingReviews: 0,
        approvedUpdates: 0,
        totalStudents: 128 // Mock for now
    });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqRes, courseRes] = await Promise.all([
                    api.get('/api/requests/my-requests'),
                    api.get('/api/courses')
                ]);

                const requests = reqRes.data;
                const courses = courseRes.data;

                setStats({
                    myCourses: courses.length,
                    pendingReviews: requests.filter(r => r.status === 'pending').length,
                    approvedUpdates: requests.filter(r => r.status === 'approved').length,
                    totalStudents: 128
                });

                // Set recent notifications (Top 5)
                setNotifications(requests.slice(0, 5));

            } catch (error) {
                console.error("Failed to load faculty data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BookOpen} label="My Courses" value={loading ? "..." : stats.myCourses} color="bg-blue-500" />
                <StatCard icon={Users} label="Total Students" value={loading ? "..." : stats.totalStudents} color="bg-purple-500" />
                <StatCard icon={Clock} label="Pending Reviews" value={loading ? "..." : stats.pendingReviews} color="bg-orange-500" />
                <StatCard icon={CheckCircle} label="Approved Updates" value={loading ? "..." : stats.approvedUpdates} color="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Action Banner */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2">Manage Your Curriculum</h2>
                            <p className="text-gray-300 mb-6 max-w-md">Update syllabi, propose new electives, and review student progress for the upcoming semester.</p>
                            <button
                                onClick={() => navigate('/curriculum')}
                                className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                            >
                                Go to Curriculum
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white p-6 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-extrabold text-gray-800">Updates</h3>
                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-blue-500 shadow-sm transition-colors">
                            <Bell size={16} />
                        </button>
                    </div>
                    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-sm text-center text-gray-400 py-4">Loading updates...</p>
                        ) : notifications.length > 0 ? (
                            notifications.map(n => (
                                <NotificationItem key={n._id} request={n} />
                            ))
                        ) : (
                            <p className="text-sm text-center text-gray-400 py-4">No recent updates.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
