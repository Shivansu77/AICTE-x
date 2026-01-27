import React from 'react';
import { FileText, AlertCircle, Users, BookOpen } from 'lucide-react';
import StatCard from '../components/adminScreen/StatCard';
import RequestItem from '../components/adminScreen/RequestItem';

const AdminScreen = () => {
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
                    </div>
                </div>

                {/* System Activity / Recent Actions (Placeholder) */}
                <div className="bg-accent-blue/5 p-6 rounded-[2.5rem] border-2 border-white flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-accent-blue shadow-sm mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">System Reports</h3>
                    <p className="text-secondary max-w-xs mb-6">Generate detailed compliance reports for AICTE monitoring.</p>
                    <button className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95">
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminScreen;
