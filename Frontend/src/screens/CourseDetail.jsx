import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Book, FileText, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import api from '../utils/api';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeSemester, setActiveSemester] = useState(1);

    // --- UI HELPERS ---
    const gradients = {
        primary: "from-amber-50 to-orange-50",
        sidebar: "bg-[#FDFBF7] dark:bg-[#1a1a2e]", // Creamy background / dark navy
        card: "bg-white",
        activePill: "bg-white shadow-sm text-orange-500 font-extrabold",
        inactivePill: "text-gray-400 hover:bg-white/50 hover:text-gray-600 font-bold"
    };

    // Form State for Subject
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        credits: 3,
        semester: 1,
        units: [] // Simplified for now, initial creation might just be basic info
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
        <div className={`min-h-full ${gradients.sidebar} flex font-sans text-gray-900 dark:text-gray-100 overflow-hidden`}>

            {/* LEFT SIDEBAR - SEMESTERS */}
            <aside className="w-64 flex flex-col p-6 overflow-y-auto">
                <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 font-bold mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 pl-2">Curriculum</h2>

                <div className="space-y-3 flex-1">
                    {Array.from({ length: course.totalSemesters }).map((_, idx) => {
                        const sem = idx + 1;
                        const isActive = activeSemester === sem;
                        return (
                            <button
                                key={sem}
                                onClick={() => setActiveSemester(sem)}
                                className={`w-full py-4 px-6 rounded-[2rem] text-left transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${isActive ? 'bg-white dark:bg-[#2d3748] shadow-lg shadow-orange-500/10 text-orange-500 dark:text-orange-400 scale-105' : 'text-gray-400 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <span className={`font-extrabold text-lg relative z-10`}>Semester {sem}</span>
                                {isActive && <div className="absolute right-4 w-2 h-2 rounded-full bg-orange-400"></div>}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 min-h-0 flex flex-col">
                <div className="bg-white/50 dark:bg-[#16213e] backdrop-blur-xl border border-white/60 dark:border-gray-700 rounded-[3rem] flex-1 flex flex-col shadow-sm relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 dark:bg-accent-blue/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                    {/* Header */}
                    <header className="px-10 py-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">{course.code}</span>
                                <span className="text-gray-400 dark:text-gray-400 font-bold text-sm">{course.totalCredits} Credits Total</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-tight max-w-2xl">{course.title}</h1>
                            <p className="text-gray-400 dark:text-gray-400 font-medium mt-2 max-w-lg truncate">{course.department}</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-gray-900 text-white dark:bg-orange-600 dark:text-white dark:border-0 px-8 py-4 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 dark:hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-2 group"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add Subject
                        </button>
                    </header>

                    {/* Content Scroll View */}
                    <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Semester {activeSemester} Subjects</h3>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">{activeSubjects.length} subjects</span>
                        </div>

                        {activeSubjects.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center opacity-60">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <Book className="text-gray-300 dark:text-gray-500" size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-400 dark:text-gray-400 mb-2">No subjects yet</h4>
                                <p className="text-gray-400 dark:text-gray-500 max-w-xs mx-auto">This semester is empty. Use the "Add Subject" button to start building the curriculum.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {activeSubjects.map((sub, idx) => (
                                    <div
                                        key={sub._id}
                                        onClick={() => navigate(`/curriculum/${sub._id}`)}
                                        className="group bg-white dark:bg-[#1f2937] rounded-[2.5rem] p-6 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 border border-transparent dark:border-gray-700 hover:border-orange-100 dark:hover:border-orange-500/30 cursor-pointer relative overflow-hidden flex items-center gap-6"
                                    >
                                        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-inner shrink-0 ${['bg-blue-50 text-blue-500 dark:bg-blue-900/40 dark:text-blue-300', 'bg-green-50 text-green-500 dark:bg-green-900/40 dark:text-green-300', 'bg-purple-50 text-purple-500 dark:bg-purple-900/40 dark:text-purple-300', 'bg-orange-50 text-orange-500 dark:bg-orange-900/40 dark:text-orange-300'][idx % 4]}`}>
                                            {sub.code.split('-').pop()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{sub.title}</h4>

                                            </div>
                                            <p className="text-gray-400 dark:text-gray-400 font-medium text-sm line-clamp-2 leading-relaxed max-w-2xl">{sub.description}</p>

                                            <div className="flex items-center gap-4 mt-3">
                                                {['Processing', 'Data'].map((tag, i) => ( // Mock tags for now
                                                    <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{tag}</span>
                                                ))}
                                                <span className="text-gray-300 dark:text-gray-600 text-xs font-bold">•</span>
                                                <span className="text-gray-400 dark:text-gray-400 text-xs font-bold">{sub.credits} Credits</span>
                                            </div>
                                        </div>

                                        <div className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all text-gray-300 dark:text-gray-500">
                                            <ChevronRight size={20} />
                                        </div>

                                        {/* Delete Button (Admin only) */}
                                        <button
                                            onClick={(e) => handleDeleteSubject(sub._id, e)}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white flex items-center justify-center text-gray-400 dark:text-gray-400 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                                            title="Delete Subject"
                                        >
                                            <Trash2 size={16} />
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
                <div className="fixed inset-0 bg-gray-900/20 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1f2937] rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#111827] border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">Add Subject to Sem {activeSemester}</h3>
                            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-gray-500 dark:text-gray-300">✕</button>
                        </div>
                        <form onSubmit={(e) => {
                            // Update semester automatically before submit
                            const newFormData = { ...formData, semester: activeSemester };
                            setFormData(newFormData); // Async issue potentially with state, better handle in payload construction
                            handleCreateSubject(e, activeSemester);
                        }} className="p-8 space-y-5">

                            <div className="grid grid-cols-3 gap-5">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Subject Code</label>
                                    <input required placeholder="e.g. CS101" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/30 transition-all" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Subject Title</label>
                                    <input required placeholder="e.g. Intro to AI" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/30 transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Short Description</label>
                                <textarea required rows="3" placeholder="What is this subject about?" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/30 transition-all resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Credits</label>
                                    <input required type="number" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-500/30 transition-all" value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Semester</label>
                                    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-500 dark:text-gray-400 cursor-not-allowed">
                                        Semester {activeSemester}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-black text-white dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
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
