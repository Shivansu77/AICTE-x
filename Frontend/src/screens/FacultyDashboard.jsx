import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, Bell, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/faculty/StatCard';
import NotificationItem from '../components/faculty/NotificationItem';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        myCourses: 0,
        pendingReviews: 0,
        approvedUpdates: 0,
        totalStudents: 0
    });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllUpdates, setShowAllUpdates] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const courseRes = await api.get('/courses');
                const courses = courseRes.data;

                // Fetch requests (optional - handle auth gracefully)
                let requests = [];
                try {
                    const reqRes = await api.get('/requests/my-requests');
                    requests = reqRes.data;
                } catch (reqErr) {
                    if (reqErr.response?.status === 401) {
                        console.warn('Auth required for requests, continuing without them');
                    } else {
                        console.error('Error fetching requests:', reqErr);
                    }
                }

                // Fetch student count (optional - handle auth gracefully)
                let studentCount = 0;
                try {
                    const studentsRes = await api.get('/users/students');
                    studentCount = studentsRes.data?.length || 0;
                } catch (studErr) {
                    if (studErr.response?.status === 401) {
                        console.warn('Auth required for students, showing 0');
                    } else {
                        console.error('Error fetching students:', studErr);
                    }
                }

                setStats({
                    myCourses: courses.length,
                    pendingReviews: requests.filter(r => r.status === 'pending').length,
                    approvedUpdates: requests.filter(r => r.status === 'approved').length,
                    totalStudents: studentCount
                });

                // Set recent notifications
                setNotifications(requests);

            } catch (error) {
                console.error("Failed to load faculty data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Show only 3 items by default, or all if expanded
    const displayedNotifications = showAllUpdates ? notifications : notifications.slice(0, 3);
    const hasMoreNotifications = notifications.length > 3;

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="My Courses"
                    value={loading ? "..." : stats.myCourses}
                    color="bg-blue-500"
                    onClick={() => navigate('/curriculum')}
                />
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={loading ? "..." : stats.totalStudents}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Reviews"
                    value={loading ? "..." : stats.pendingReviews}
                    color="bg-orange-500"
                    onClick={() => setShowAllUpdates(true)}
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved Updates"
                    value={loading ? "..." : stats.approvedUpdates}
                    color="bg-green-500"
                    onClick={() => setShowAllUpdates(true)}
                />
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
                    <div className="space-y-1">
                        {loading ? (
                            <p className="text-sm text-center text-gray-400 py-4">Loading updates...</p>
                        ) : notifications.length > 0 ? (
                            <>
                                {displayedNotifications.map(n => (
                                    <NotificationItem key={n._id} request={n} />
                                ))}

                                {/* Show More/Less Button */}
                                {hasMoreNotifications && (
                                    <button
                                        onClick={() => setShowAllUpdates(!showAllUpdates)}
                                        className="w-full py-3 mt-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {showAllUpdates ? (
                                            <>
                                                Show Less <ChevronUp size={16} />
                                            </>
                                        ) : (
                                            <>
                                                Show {notifications.length - 3} More <ChevronDown size={16} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
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
