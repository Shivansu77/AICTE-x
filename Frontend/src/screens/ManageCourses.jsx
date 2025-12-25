import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Book, Clock, Layers, Edit3, Trash2, GraduationCap, Building2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ManageCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const initialFormState = {
        title: '',
        code: '',
        department: '',
        type: 'Degree',
        durationYears: 4,
        totalSemesters: 8,
        totalCredits: 160
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingId) {
                response = await api.put(`/courses/${editingId}`, formData);
            } else {
                response = await api.post('/courses', formData);
            }

            if (response.status === 200 || response.status === 201) {
                setShowForm(false);
                setFormData(initialFormState);
                setEditingId(null);
                fetchCourses();
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        try {
            const response = await api.delete(`/courses/${id}`);
            if (response.status === 200) {
                fetchCourses();
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const openEditModal = (e, course) => {
        e.stopPropagation();
        setFormData({
            title: course.title,
            code: course.code,
            department: course.department,
            type: course.type,
            durationYears: course.durationYears,
            totalSemesters: course.totalSemesters,
            totalCredits: course.totalCredits
        });
        setEditingId(course._id);
        setShowForm(true);
    };

    const openNewModal = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setShowForm(true);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-7xl mx-auto px-4 md:px-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 shrink-0 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-cyan-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-accent-blue/20 hover:rotate-6 transition-transform">
                        <GraduationCap size={40} />
                    </div>
                    <div>
                        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-secondary hover:text-primary font-bold text-sm mb-2 transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-primary tracking-tight">Master Courses</h1>
                        <p className="text-secondary font-medium text-lg">Manage AICTE-approved degree programs</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={async () => {
                            await api.post('/courses/seed');
                            fetchCourses();
                        }}
                        className="bg-white text-primary px-7 py-4 rounded-full font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md hover:translate-y-[-2px] transition-all flex items-center gap-2"
                    >
                        <Zap size={16} className="text-accent-yellow" /> Seed Defaults
                    </button>
                    <button
                        onClick={openNewModal}
                        className="bg-primary text-white px-9 py-4 rounded-full font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Add New Course</span>
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2 -mr-2">
                {/* Modal Overlay */}
                {showForm && (
                    <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
                            <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-primary">{editingId ? 'Edit Master Course' : 'New Master Course'}</h2>
                                    <p className="text-secondary text-sm font-medium">Standardize the academic program details.</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold text-secondary">✕</button>
                            </div>
                            <form onSubmit={handleCreateOrUpdateCourse} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Course Title</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. B.Tech Computer Science"
                                            className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all placeholder:font-medium"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Course Code</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. BTECH-CSE"
                                            className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all uppercase placeholder:font-medium"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Department</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all placeholder:font-medium"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="Degree">Degree Program</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Certificate">Certificate</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                                                <Layers size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Credits</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all"
                                            value={formData.totalCredits}
                                            onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all"
                                    >
                                        {editingId ? 'Update Master Course' : 'Create Master Course'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Course List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-30">
                            <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                            <p className="text-secondary font-black text-xl uppercase tracking-widest">Loading Master Data</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 text-secondary/20">
                                <Book size={48} />
                            </div>
                            <h4 className="text-2xl font-black text-primary mb-2">No Courses Defined</h4>
                            <p className="text-secondary font-medium max-w-sm">AICTE Master Registry is empty. Add your first academic program or seed defaults.</p>
                        </div>
                    ) : (
                        courses.map((course, idx) => (
                            <div
                                key={course._id}
                                onClick={() => navigate(`/admin/course/${course._id}`)}
                                className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-500 cursor-pointer relative overflow-hidden border border-gray-100 hover:border-accent-blue/20"
                            >
                                {/* Decorative Circles */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-blue/10 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-peach/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-accent-peach/10 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${idx % 3 === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            idx % 3 === 1 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            {course.code}
                                        </div>

                                        <div className="flex gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                            <button
                                                onClick={(e) => openEditModal(e, course)}
                                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 text-secondary hover:text-accent-blue hover:border-accent-blue/30 flex items-center justify-center transition-all"
                                                title="Edit Course"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, course._id)}
                                                className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 text-secondary hover:text-red-500 hover:border-red-100 flex items-center justify-center transition-all"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-primary leading-[1.2] mb-3 group-hover:text-accent-blue transition-colors">{course.title}</h3>

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
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageCourses;
