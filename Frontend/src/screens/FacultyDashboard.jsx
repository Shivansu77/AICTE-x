import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, Bell, FileText, CheckCircle } from 'lucide-react';

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

const NotificationItem = ({ title, time, type }) => (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-50 last:border-0 cursor-pointer group">
        <div className={`mt-1 w-2 h-2 rounded-full ${type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
        <div>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{title}</h4>
            <span className="text-xs text-gray-400 font-medium">{time}</span>
        </div>
    </div>
);

const FacultyDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BookOpen} label="My Courses" value="3" color="bg-blue-500" />
                <StatCard icon={Users} label="Total Students" value="128" color="bg-purple-500" />
                <StatCard icon={Clock} label="Pending Reviews" value="2" color="bg-orange-500" />
                <StatCard icon={CheckCircle} label="Approved Updates" value="5" color="bg-green-500" />
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
                        <NotificationItem title="Curriculum update approved for CS-101" time="2 hours ago" type="normal" />
                        <NotificationItem title="Submit grading for Mid-Sem" time="Yesterday" type="urgent" />
                        <NotificationItem title="New department meeting scheduled" time="Dec 15" type="normal" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
