import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Book, FileText, ChevronRight, Edit3 } from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

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
                const token = localStorage.getItem('token');
                const [courseRes, subjectsRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/courses/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`http://localhost:8000/api/curriculum/course/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (courseRes.ok) setCourse(await courseRes.json());
                if (subjectsRes.ok) setSubjects(await subjectsRes.json());
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData, courseId: id, units: [] }; // Empty units for start

            const response = await fetch('http://localhost:8000/api/curriculum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({ title: '', code: '', description: '', credits: 3, semester: 1, units: [] });
                // Refresh subjects
                const subjectsRes = await fetch(`http://localhost:8000/api/curriculum/course/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                setSubjects(await subjectsRes.json());
            } else {
                alert('Failed to create subject');
            }
        } catch (error) {
            console.error(error);
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

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
                    <button onClick={() => navigate('/admin/courses')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>{course.code}</span>
                            <ChevronRight className="w-4 h-4" />
                            <span>Curriculum Management</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{course.title}</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Add Subject Button */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Master Curriculum</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Subject
                        </button>
                    </div>

                    {/* Semester-wise Lists */}
                    <div className="space-y-8">
                        {Array.from({ length: course.totalSemesters }).map((_, idx) => {
                            const sem = idx + 1;
                            const semSubjects = subjectsBySemester[sem] || [];

                            return (
                                <div key={sem} className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Semester {sem}</h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{semSubjects.length} Subjects</span>
                                    </div>

                                    {semSubjects.length === 0 ? (
                                        <div className="text-sm text-gray-400 italic">No subjects added yet.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {semSubjects.map(sub => (
                                                <div key={sub._id} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                                                    onClick={() => navigate(`/curriculum/${sub._id}`)}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{sub.code}</span>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Edit3 className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1">{sub.title}</h4>
                                                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                                        <span>{sub.credits} Credits</span>
                                                        <span>V{sub.version}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                                <form onSubmit={handleCreateSubject} className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Add New Subject</h3>
                                    <div className="space-y-4">
                                        <input required placeholder="Subject Code (e.g. CSE-101)" className="w-full p-2 border rounded" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                                        <input required placeholder="Subject Title" className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        <textarea required placeholder="Description" className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs block mb-1">Semester</label>
                                                <input required type="number" className="w-full p-2 border rounded" value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label className="text-xs block mb-1">Credits</label>
                                                <input required type="number" className="w-full p-2 border rounded" value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add Subject</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CourseDetail;
