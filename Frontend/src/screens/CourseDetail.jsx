import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Book, FileText, ChevronRight, Edit3, Trash2, GraduationCap, Clock, Award, Layers } from 'lucide-react';
import api from '../utils/api';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeSemester, setActiveSemester] = useState(1);

    // Form State for Subject
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        credits: 3,
        semester: 1,
        units: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, subjectsRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    api.get(`/curriculum/course/${id}`)
                ]);

                setCourse(courseRes.data);
                setSubjects(subjectsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateSubject = async (e, forcedSemester = 1) => {
        e.preventDefault();
        try {
            // forcedSemester comes from the form submit handler
            const payload = { ...formData, courseId: id, semester: forcedSemester || formData.semester, units: [] };

            await api.post('/curriculum', payload);

            setShowForm(false);
            setFormData({ title: '', code: '', description: '', credits: 3, semester: 1, units: [] });
            // Refresh subjects
            const subjectsRes = await api.get(`/curriculum/course/${id}`);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteSubject = async (subjectId, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (!window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/curriculum/${subjectId}`);

            // Refresh subjects list
            const subjectsRes = await api.get(`/curriculum/course/${id}`);
            setSubjects(subjectsRes.data);
            alert('Subject deleted successfully');

        } catch (error) {
            console.error(error);
            alert('Error deleting subject');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Data...</div>;
    if (!course) return <div className="p-10 text-center">Course not found</div>;

    // Group subjects by semester
    const subjectsBySemester = subjects.reduce((acc, subject) => {
        acc[subject.semester] = acc[subject.semester] || [];
        acc[subject.semester].push(subject);
        return acc;
    }, {});

    // Filter subjects for active semester
    const activeSubjects = subjects.filter(s => s.semester === activeSemester);

    return (
        <div className="min-h-full bg-gray-50 dark:bg-gray-900 flex font-sans text-gray-900 dark:text-gray-100 overflow-hidden">

            {/* LEFT SIDEBAR - SEMESTERS */}
            <aside className="w-72 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 overflow-y-auto">
                {/* Sidebar Header with Image */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 font-bold mb-6 transition-colors">
                        <ArrowLeft size={18} /> Back
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-blue-400/30 shadow-lg shadow-blue-500/10">
                            <img 
                                src="/curriculum.jpg" 
                                alt="Curriculum" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center">
                                <GraduationCap size={24} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-800 dark:text-gray-100">Curriculum</h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{course?.totalSemesters} Semesters</p>
                        </div>
                    </div>
                </div>

                {/* Semester List */}
                <div className="flex-1 p-4 space-y-2">
                    {Array.from({ length: course?.totalSemesters || 8 }).map((_, idx) => {
                        const sem = idx + 1;
                        const isActive = activeSemester === sem;
                        const semSubjects = subjects.filter(s => s.semester === sem);
                        return (
                            <button
                                key={sem}
                                onClick={() => setActiveSemester(sem)}
                                className={`w-full py-3 px-4 rounded-xl text-left transition-all duration-200 flex justify-between items-center ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <div>
                                    <span className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>Semester {sem}</span>
                                    <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {semSubjects.length} subjects
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 min-h-0 flex flex-col overflow-hidden">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl flex-1 flex flex-col shadow-sm relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    {/* Header */}
                    <header className="relative px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{course?.code}</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-lg text-xs font-bold">{course?.type}</span>
                                </div>
                                <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 tracking-tight mb-2">{course?.title}</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">{course?.department}</p>
                                
                                {/* Stats Row */}
                                <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock size={16} className="text-blue-500" />
                                        <span><strong>{course?.durationYears}</strong> Years</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Layers size={16} className="text-purple-500" />
                                        <span><strong>{course?.totalSemesters}</strong> Semesters</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Award size={16} className="text-emerald-500" />
                                        <span><strong>{course?.totalCredits}</strong> Credits</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Subject
                            </button>
                        </div>
                    </header>

                    {/* Content Scroll View */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Semester {activeSemester}</h3>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">{activeSubjects.length} subjects</span>
                        </div>

                        {activeSubjects.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
                                    <Book className="text-gray-400 dark:text-gray-500" size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">No subjects yet</h4>
                                <p className="text-gray-400 dark:text-gray-500 max-w-xs">This semester is empty. Click "Add Subject" to start building the curriculum.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {activeSubjects.map((sub, idx) => (
                                    <div
                                        key={sub._id}
                                        onClick={() => navigate(`/curriculum/${sub._id}`)}
                                        className="group bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 border border-transparent hover:border-blue-100 dark:hover:border-blue-500/30 cursor-pointer relative"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${
                                                ['bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300', 
                                                 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300', 
                                                 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300', 
                                                 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300'][idx % 4]
                                            }`}>
                                                {sub.code?.split('-').pop() || 'S'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{sub.title}</h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{sub.description}</p>

                                                <div className="flex items-center gap-3">
                                                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-bold">{sub.code}</span>
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">{sub.credits} Credits</span>
                                                </div>
                                            </div>

                                            <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDeleteSubject(sub._id, e)}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center text-gray-400 dark:text-gray-400 transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Subject"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">Add New Subject</h3>
                                <p className="text-blue-100 text-sm">Semester {activeSemester}</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white">✕</button>
                        </div>
                        <form onSubmit={(e) => {
                            const newFormData = { ...formData, semester: activeSemester };
                            setFormData(newFormData);
                            handleCreateSubject(e, activeSemester);
                        }} className="p-6 space-y-5">

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Code</label>
                                    <input required placeholder="CS101" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200 dark:border-gray-600 transition-all" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                    <input required placeholder="Introduction to AI" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200 dark:border-gray-600 transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea required rows="3" placeholder="Brief description of the subject..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200 dark:border-gray-600 transition-all resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Credits</label>
                                    <input required type="number" min="1" max="10" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-gray-200 dark:border-gray-600 transition-all" value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Semester</label>
                                    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-xl font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                        Semester {activeSemester}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Create Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
