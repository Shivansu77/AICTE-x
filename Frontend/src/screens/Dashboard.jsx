import React, { useEffect, useState } from 'react';
import { Book, Clock, Edit3, ArrowRight, Eye, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import FacultyScreen from './FacultyScreen';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import { useNavigate } from 'react-router-dom';

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
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${bgClass} shadow-sm`}>
                    {code}
                </span>
                <span className="text-gray-500 text-sm font-semibold flex items-center gap-1.5">
                    <Clock size={14} className="opacity-60" /> {credits} Credits
                </span>
            </div>

            <div className="flex gap-5 mb-6 flex-1">
                <div className={`shrink-0 w-16 h-16 ${bgClass}/10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon size={28} className="text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-accent-blue transition-colors leading-snug">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <Link
                    to={`/curriculum/${_id}`}
                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
                >
                    <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                    View Details
                </Link>

                {/* Only Faculty can see Manage button */}
                {(role === 'teacher' || role === 'faculty') && (
                    <Link
                        to={`/curriculum/${_id}`}
                        className={`flex-1 py-2.5 px-4 rounded-xl ${bgClass} text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group/btn`}
                    >
                        <Edit3 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        Manage
                    </Link>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All Semesters");
    const [queries, setQueries] = useState([]);
    const [queryForm, setQueryForm] = useState({
        subject: '',
        message: '',
        category: 'general_query'
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const { user } = useUser();
    const role = user.role || 'student'; // Default to student
    const navigate = useNavigate();

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

    const fetchMyQueries = async () => {
        try {
            const response = await api.get('/user/my-queries');
            setQueries(response.data);
        } catch (error) {
            console.error('Failed to fetch queries:', error);
        }
    };

    const handleSubmitQuery = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitMessage('');

        try {
            await api.post('/user/student-query', queryForm);
            setSubmitMessage('Query submitted successfully!');
            setQueryForm({ subject: '', message: '', category: 'general_query' });
            fetchMyQueries();
        } catch (error) {
            setSubmitMessage('Failed to submit query. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        fetchCurricula();

        // Refetch when the tab gains focus
        const handleFocus = () => fetchCurricula();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    useEffect(() => {
        if (role === 'student') {
            fetchMyQueries();
        }
    }, [role]);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-secondary font-bold">Loading Portal...</div>;
    }

    // Unified Dashboard View
    return (
        <div className="space-y-8">
            {/* Header / Role Specific Views */}
            {role === 'admin' ? (
                <AdminDashboard />
            ) : (role === 'teacher' || role === 'faculty') ? (
                <FacultyDashboard />
            ) : (
                <>
                    {/* Header Info (Optional) */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                            <User size={16} className="text-secondary" />
                            <span className="text-xs font-bold text-secondary uppercase tracking-wider">{role} View</span>
                        </div>
                    </div>

                    {/* MISSION BANNER */}
                    <div className="bg-gradient-to-r from-accent-blue via-accent-blue to-cyan-500 rounded-[2.5rem] p-8 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transalte-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 backdrop-blur-md border border-white/20">Aicte-X</span>
                            <h1 className="text-3xl font-extrabold mb-4 leading-tight">One Nation, One Curriculum</h1>
                            <p className="text-white/90 font-medium leading-relaxed">
                                A unified platform for developing, sharing, and standardizing model curricula across all AICTE-approved institutes. Ensuring consistency and quality education for the future of India.
                            </p>
                        </div>
                    </div>

                </>
            )}

            {/* CURRICULUM BROWSER (Visible to ALL) */}
            <div className="pt-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">Browse Curriculum</h2>
                        <p className="text-gray-600 font-medium">Explore model curricula across different programs and semesters</p>
                    </div>
                </div>

                {/* Filtering Pills */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-6">
                    {["All Semesters", "Semester 3", "Semester 4", "Semester 5"].map((label, idx) => (
                        <button
                            key={label}
                            onClick={() => setActiveFilter(label)}
                            className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeFilter === label
                                ? "bg-accent-peach text-white shadow-md shadow-accent-peach/30"
                                : "bg-white text-secondary hover:bg-white/80 border border-gray-100"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                {curricula.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {curricula
                            .filter(c => activeFilter === "All Semesters" || `Semester ${c.semester}` === activeFilter)
                            .map((course) => (
                                <CourseCard key={course._id || course.code} {...course} icon={Book} role={role} />
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-secondary">No subjects found.</h3>
                        <p className="text-secondary/70">Add courses and subjects through the admin panel.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
