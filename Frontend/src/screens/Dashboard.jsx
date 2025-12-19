import React, { useEffect, useState } from 'react';
import { Book, Clock, Edit3, ArrowRight, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import FacultyScreen from './FacultyScreen';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';

// ...
// --- ADMIN PORTAL VIEW ---
// ...

const CourseCard = ({ _id, title, code, credits, color, icon: Icon, description, role }) => {
    const colorClasses = {
        blue: "bg-accent-blue",
        peach: "bg-accent-peach",
        green: "bg-accent-green",
        yellow: "bg-accent-yellow"
    };

    const bgClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 hover:translate-y-[-4px] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${bgClass}`}>
                    {code}
                </span>
                <span className="text-secondary text-sm font-bold flex items-center gap-1">
                    <Clock size={14} /> {credits} Credits
                </span>
            </div>

            <div className="flex gap-6 items-center mb-6">
                <div className={`shrink-0 w-24 h-24 ${bgClass}/20 rounded-3xl flex items-center justify-center`}>
                    <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm text-${color}-600`}>
                        <Icon size={24} className={`text-gray-700`} />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold text-primary mb-2 group-hover:text-accent-blue transition-colors">
                        {title}
                    </h3>
                    <p className="text-secondary text-sm font-medium leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-auto">
                <Link to={`/curriculum/${code}`} className={`flex-1 py-1 px-2 rounded-full border-2 border-transparent hover:bg-gray-50 text-secondary font-bold text-sm transition-colors flex items-center justify-center gap-2`}>
                    <Eye size={16} /> View Details
                </Link>

                {/* Only Faculty can see Manage button */}
                {(role === 'teacher' || role === 'faculty') && (
                    <button
                        onClick={() => alert(`Manage feature for ${code} coming soon!`)}
                        className={`flex-1 py-3 px-6 rounded-full ${bgClass} text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95`}
                    >
                        <Edit3 size={16} /> Manage
                    </button>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student'; // Default to student

    useEffect(() => {
        // If Admin, we might not need to fetch curricula immediately if the AdminDashboard handles its own data, 
        // but for now let's keep fetching or let AdminDashboard handle it.
        if (role === 'admin') {
            setLoading(false);
            return;
        }

        const fetchCurricula = async () => {
            try {
                const response = await api.get('/api/curriculum');
                setCurricula(response.data);
            } catch (error) {
                console.error("Failed to fetch curriculum", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurricula();
    }, [role]);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-secondary font-bold">Loading Portal...</div>;
    }

    // --- ADMIN PORTAL VIEW ---
    if (role === 'admin') {
        return <AdminDashboard />;
    }

    // --- FACULTY PORTAL VIEW ---
    if (role === 'teacher' || role === 'faculty') {
        return <FacultyDashboard />;
    }

    return (
        <div className="space-y-8">
            {/* Header Info (Optional) */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <User size={16} className="text-secondary" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">{role} View</span>
                </div>
            </div>

            {/* ANNOUNCEMENT SECTION */}
            <div className="bg-accent-yellow/10 border-2 border-accent-yellow/20 rounded-[2rem] p-6">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center text-white"><Clock size={16} /></span>
                    Latest Announcements
                </h3>
                {/* Fetch and map announcements here - using placeholder/mock for now unless we add fetch logic */}
                <div className="space-y-3">
                    {/* Note: In a real app, we would fetch these from /api/announcement */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-4">
                        <div className="p-2 bg-accent-peach/10 text-accent-peach rounded-lg font-bold text-xs uppercase">New</div>
                        <div>
                            <h4 className="font-bold text-primary text-sm">SIH 2025 Registration Open</h4>
                            <p className="text-xs text-secondary mt-1">Smart India Hackathon registrations are now live! Register your teams before Jan 20th.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtering Pills */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {["All Semesters", "Semester 3", "Semester 4", "Semester 5"].map((label, idx) => (
                    <button
                        key={label}
                        className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${idx === 0
                            ? "bg-accent-peach text-white shadow-md"
                            : "bg-white text-secondary hover:bg-white/80"
                            }`}
                    >
                        {label}
                    </button>
                ))}
                {/* Seed Button for Demo */}
                <button
                    onClick={async () => {
                        await api.get('/api/curriculum/seed');
                        window.location.reload();
                    }}
                    className="px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20"
                >
                    Reset/Seed Data
                </button>
            </div>

            {/* Course Grid */}
            {curricula.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {curricula.map((course) => (
                        <CourseCard key={course._id || course.code} {...course} icon={Book} role={role} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold text-secondary">No courses found.</h3>
                    <p className="text-secondary/70">Try seeding data using the button above.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
