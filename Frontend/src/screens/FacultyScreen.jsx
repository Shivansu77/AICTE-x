import React, { useState, useEffect } from 'react';
import { Book, Plus, ArrowRight, User, GraduationCap, Building2, Clock, Layers, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';

const FacultyScreen = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFaculty = user?.role === 'teacher' || user?.role === 'faculty' || user?.role === 'admin';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses');
                setCourses(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 opacity-30 h-full">
                <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-secondary font-black text-xl uppercase tracking-widest">Gathering Academic Programs</p>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-7xl mx-auto px-4 md:px-8 relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-end justify-between mb-10 shrink-0 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-cyan-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-accent-blue/20 hover:scale-105 transition-transform">
                        <User size={40} />
                    </div>
                    <div>
                        {isFaculty && (
                            <div className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-flex items-center gap-1.5 border border-accent-blue/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
                                Faculty Access
                            </div>
                        )}
                        <h1 className="text-4xl font-black text-primary tracking-tight">
                            {isFaculty ? "Faculty Dashboard" : "Student Curriculum"}
                        </h1>
                        <p className="text-secondary font-medium text-lg">
                            {isFaculty ? "Select a program to manage curriculum updates" : "Browse available academic programs"}
                        </p>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2 -mr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, idx) => (
                        <div
                            key={course._id}
                            onClick={() => navigate(isFaculty ? `/faculty/course/${course._id}` : `/student/course/${course._id}`)}
                            className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-500 cursor-pointer relative overflow-hidden border border-gray-100 hover:border-accent-blue/20"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${idx % 3 === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        idx % 3 === 1 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                        {course.code}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-primary leading-[1.2] mb-3 group-hover:text-accent-blue transition-colors">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-2 text-secondary font-bold text-xs mb-8">
                                    <Building2 size={14} className="opacity-40" />
                                    {course.department}
                                </div>

                                <div className="bg-gray-50/50 rounded-2xl p-5 flex items-center justify-between border border-gray-100/50 group-hover:bg-white group-hover:border-accent-blue/10 transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-secondary tracking-widest opacity-50">Duration</p>
                                        <div className="flex items-center gap-1.5 font-black text-primary">
                                            <Clock size={12} className="text-accent-blue" />
                                            <span>{course.durationYears} Years</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-secondary tracking-widest opacity-50">Academic</p>
                                        <div className="flex items-center gap-1.5 font-black text-primary text-right">
                                            <Layers size={12} className="text-accent-peach" />
                                            <span>{course.totalSemesters} Semesters</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-6 py-3.5 rounded-2xl bg-primary text-white font-black text-sm hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isFaculty ? "Manage Curriculum" : "View Curriculum"} <Zap size={16} className="text-accent-yellow" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-secondary/20">
                            <Book size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-primary mb-2">No Active Programs</h4>
                        <p className="text-secondary font-medium max-w-sm mb-8">There are no course programs available in the master registry yet.</p>

                        {isFaculty && (
                            <button
                                onClick={async () => {
                                    try {
                                        await api.post('/api/curriculum/seed');
                                        window.location.reload();
                                    } catch (e) { console.error(e); }
                                }}
                                className="px-8 py-4 bg-primary text-white rounded-full font-black text-sm shadow-xl hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} /> Seed Demo Data
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FacultyScreen;
