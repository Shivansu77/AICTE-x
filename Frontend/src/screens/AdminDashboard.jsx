import React from 'react';
import { CheckCircle, XCircle, FileText, AlertCircle, Users, BookOpen } from 'lucide-react';

const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-4">
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

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Courses" value="124" color="bg-accent-blue" icon={BookOpen} />
                <StatCard title="Active Faculty" value="850" color="bg-accent-peach" icon={Users} />
                <StatCard title="Pending Requests" value="12" color="bg-accent-yellow" icon={AlertCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Approvals */}
                <div className="bg-white/50 p-6 rounded-[2.5rem] border-2 border-white">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-2xl font-extrabold text-primary">Pending Approvals</h3>
                        <button className="text-accent-blue font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        <RequestItem title="Into to AI - Unit 4 Update" requestedBy="Dr. Anjali R." type="Update" date="Today, 10:30 AM" />
                        <RequestItem title="New Elective: Blockchain" requestedBy="Prof. S. Mehta" type="New" date="Yesterday" />
                        <RequestItem title="Data Science Lab Manual" requestedBy="Dr. K. Singh" type="Update" date="DEC 15" />
                        <RequestItem title="Cyber Security Syllabus" requestedBy="Prof. John D." type="New" date="DEC 14" />
                    </div>
                </div>

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
