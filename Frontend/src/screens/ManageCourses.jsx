import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Book, Clock, Layers, Lock, Unlock, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `http://localhost:8000/api/courses/${editingId}`
                : 'http://localhost:8000/api/courses';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData(initialFormState);
                setEditingId(null);
                fetchCourses();
                alert(editingId ? 'Course updated successfully!' : 'Course created successfully!');
            } else {
                const err = await response.json();
                alert(err.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/courses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchCourses();
                alert('Course deleted successfully');
            } else {
                alert('Failed to delete course');
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
        <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-gray-900 overflow-hidden">

            <div className="flex-1 flex flex-col h-screen relative">

                {/* Header */}
                <header className="px-10 py-8 flex items-end justify-between z-10">
                    <div>
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold mb-4 transition-colors">
                            <ArrowLeft size={20} /> Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Master Courses</h1>
                        <p className="text-gray-400 font-medium mt-2">Manage AICTE-approved degree programs</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem('token');
                                await fetch('http://localhost:8000/api/courses/seed', {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                fetchCourses();
                            }}
                            className="bg-white text-gray-900 px-6 py-4 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
                        >
                            Seed Defaults
                        </button>
                        <button
                            onClick={openNewModal}
                            className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Add New Course</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar relative">
                    {/* Background decor */}
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                    {/* Modal/Form Overlay */}
                    {showForm && (
                        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-xl font-extrabold text-gray-800">{editingId ? 'Edit Master Course' : 'New Master Course'}</h2>
                                    <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors font-bold text-gray-500">✕</button>
                                </div>
                                <form onSubmit={handleCreateOrUpdateCourse} className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Course Title</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. B.Tech Computer Science"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Course Code</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. BTECH-CSE"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Computer Science"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="Degree">Degree Program</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Certificate">Certificate</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Credits</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={formData.totalCredits}
                                                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration (Y)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={formData.durationYears}
                                                onChange={(e) => setFormData({ ...formData, durationYears: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semesters</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-3 bg-gray-50 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                                value={formData.totalSemesters}
                                                onChange={(e) => setFormData({ ...formData, totalSemesters: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                            <p className="text-gray-400 font-bold col-span-full text-center py-20 animate-pulse">Loading Academy Data...</p>
                        ) : courses.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-400">
                                <Book className="w-16 h-16 mb-6 opacity-20" />
                                <h4 className="text-xl font-black text-gray-300">No Courses Found</h4>
                                <p className="font-medium mt-2">Start by adding a new master course.</p>
                            </div>
                        ) : (
                            courses.map((course, idx) => (
                                <div
                                    key={course._id}
                                    onClick={() => navigate(`/admin/course/${course._id}`)}
                                    className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer relative overflow-hidden border border-transparent hover:border-blue-100"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/50 transition-colors"></div>

                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${['bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-green-50 text-green-600'][idx % 3]}`}>
                                                {course.code}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => openEditModal(e, course)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, course._id)}
                                                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-gray-400 font-bold text-sm mb-8">{course.department}</p>

                                        <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors"></div>
                                                <span>{course.durationYears} Years</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors"></div>
                                                <span>{course.totalSemesters} Semesters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageCourses;
