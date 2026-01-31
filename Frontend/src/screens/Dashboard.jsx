import React, { useEffect, useState } from 'react';
import { Book, User } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import CourseCard from '../components/dashboard/CourseCard';

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
    const role = user.role || 'student';

    const fetchCurricula = async () => {
        try {
            const response = await api.get('/curriculum');
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
        return (
            <div className="flex items-center justify-center h-full text-secondary dark:text-gray-300 font-bold">
                Loading Portal...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Role Views */}
            {role === 'admin' ? (
                <AdminDashboard />
            ) : (role === 'teacher' || role === 'faculty') ? (
                <FacultyDashboard />
            ) : (
                <>
                    {/* Role Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <User size={16} className="text-secondary dark:text-gray-300" />
                            <span className="text-xs font-bold text-secondary dark:text-gray-300 uppercase tracking-wider">
                                {role} View
                            </span>
                        </div>
                    </div>

                    {/* Mission Banner */}
                    <div className="bg-gradient-to-r from-accent-blue via-accent-blue to-cyan-500 
                                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
                                    rounded-[2.5rem] p-8 shadow-lg text-white relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-64 h-64 
                                        bg-white/20 dark:bg-accent-blue/20 
                                        rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

                        <div className="absolute inset-0 bg-black/10 dark:bg-black/40"></div>

                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-block px-3 py-1 
                                             bg-white/30 dark:bg-white/10 
                                             text-white rounded-full text-base font-extrabold mb-3 
                                             backdrop-blur-md border border-white/20 dark:border-white/10">
                                AICTE-X
                            </span>

                            <h1 className="text-4xl font-extrabold mb-4 leading-tight text-white">
                                One Nation, One Curriculum
                            </h1>

                            <p className="text-white/90 dark:text-gray-200 font-bold text-lg leading-relaxed">
                                A unified platform for developing, sharing, and standardizing model curricula 
                                across all AICTE-approved institutes. Ensuring consistency and quality education 
                                for the future of India.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Curriculum Browser */}
            <div className="pt-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                            Browse Curriculum
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Explore model curricula across different programs and semesters
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-6">
                    {["All Semesters", "Semester 3", "Semester 4", "Semester 5"].map((label) => (
                        <button
                            key={label}
                            onClick={() => setActiveFilter(label)}
                            className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                                activeFilter === label
                                    ? "bg-accent-peach text-white shadow-md shadow-accent-peach/30"
                                    : "bg-white dark:bg-gray-800 text-secondary dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
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
                        <h3 className="text-xl font-bold text-secondary dark:text-gray-300">
                            No subjects found.
                        </h3>
                        <p className="text-secondary/70 dark:text-gray-400">
                            Add courses and subjects through the admin panel.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
