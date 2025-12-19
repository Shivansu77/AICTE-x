import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Book, Clock, Layers, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        department: '',
        type: 'Degree',
        durationYears: 4,
        totalSemesters: 8,
        totalCredits: 160
    });

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

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({ title: '', code: '', department: '', type: 'Degree', durationYears: 4, totalSemesters: 8, totalCredits: 160 });
                fetchCourses();
                alert('Course created successfully!');
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to create course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Master Course Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Define and manage AICTE-approved degree programs</p>
                    </div>
                    <div className="ml-auto">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Course</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8 relative">

                    {/* Modal/Form Overlay */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-800">Add New Master Course</h2>
                                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 font-medium">Cancel</button>
                                </div>
                                <form onSubmit={handleCreateCourse} className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. B.Tech Computer Science & Engineering"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. BTECH-CSE"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all uppercase"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Computer Science"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="Degree">Degree</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Certificate">Certificate</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Credits</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.totalCredits}
                                                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.durationYears}
                                                onChange={(e) => setFormData({ ...formData, durationYears: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Semesters</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                value={formData.totalSemesters}
                                                onChange={(e) => setFormData({ ...formData, totalSemesters: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                                        >
                                            Create Course
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Course List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p className="text-gray-500 col-span-full text-center py-10">Loading courses...</p>
                        ) : courses.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
                                <Book className="w-12 h-12 mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No courses defined yet.</p>
                                <p className="text-sm">Click "Add New Course" to get started.</p>
                            </div>
                        ) : (
                            courses.map(course => (
                                <div key={course._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                                                {course.code}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{course.department}</p>
                                        </div>
                                        {course.isLocked ? <Lock className="w-5 h-5 text-red-400" /> : <Unlock className="w-5 h-5 text-green-400" />}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{course.durationYears} Years</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Layers className="w-4 h-4 text-gray-400" />
                                            <span>{course.totalSemesters} Semesters</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm col-span-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span>{course.totalCredits} Total Credits</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/admin/course/${course._id}`)}
                                        className="w-full mt-2 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        Manage Curriculum
                                    </button>
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
