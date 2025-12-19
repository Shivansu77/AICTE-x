import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, AlertCircle, Database } from 'lucide-react';
import api from '../utils/api';

const FacultyCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [courseRes, subjectsRes, requestsRes] = await Promise.all([
                    api.get(`/api/courses/${id}`),
                    api.get(`/api/curriculum/course/${id}`),
                    api.get('/api/requests/my-requests')
                ]);

                setCourse(courseRes.data);
                setSubjects(subjectsRes.data);
                setRequests(requestsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getRequestStatus = (subjectId) => {
        // Find latest request for this subject
        const subjectRequests = requests.filter(r => r.curriculumId?._id === subjectId || r.curriculumId === subjectId);
        if (subjectRequests.length === 0) return null;
        // Sort by date desc
        return subjectRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    };

    const handleSeedSubjects = async () => {
        try {
            await api.get('/api/curriculum/seed'); // Using GET as defined in routes
            window.location.reload();
        } catch (error) {
            alert('Failed to seed subjects');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!course) return <div className="p-10 text-center">Course not found</div>;

    // Group by semester
    const subjectsBySemester = subjects.reduce((acc, subject) => {
        acc[subject.semester] = acc[subject.semester] || [];
        acc[subject.semester].push(subject);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{course.code}</span>
                        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-blue-800 text-sm">Faculty Instruction</h3>
                            <p className="text-blue-600 text-sm mt-1">Select the subject you are teaching to view the curriculum, download the syllabus, or request updates for the next academic session.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {Array.from({ length: course.totalSemesters }).map((_, idx) => {
                            const sem = idx + 1;
                            const semSubjects = subjectsBySemester[sem] || [];

                            return (
                                <div key={sem} className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">{sem}</div>
                                        Semester {sem}
                                    </h3>

                                    {semSubjects.length === 0 ? (
                                        <div className="pl-8 flex items-center gap-4">
                                            <p className="text-sm text-gray-400">No subjects defined.</p>
                                            {subjects.length === 0 && idx === 2 && ( // Show seed button only once, e.g. sem 3 (where seed puts data) or if total subjects 0
                                                <button onClick={handleSeedSubjects} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                                                    <Database size={12} /> Seed Defaults
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8">
                                            {semSubjects.map(sub => {
                                                const latestReq = getRequestStatus(sub._id);
                                                return (
                                                    <div
                                                        key={sub._id}
                                                        className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-pointer bg-white relative overflow-hidden"
                                                        onClick={() => navigate(`/curriculum/${sub._id}`)}
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="font-mono text-xs font-bold text-gray-500">{sub.code}</span>
                                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Active</span>
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 h-12">{sub.title}</h4>

                                                        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                                                            <span className="flex items-center gap-1"><Clock size={12} /> {sub.credits} Credits</span>
                                                            <span className="flex items-center gap-1"><BookOpen size={12} /> {sub.units?.length || 0} Units</span>
                                                        </div>

                                                        {/* Status Badge Overlay */}
                                                        {latestReq && (
                                                            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${latestReq.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                                    latestReq.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                                                        'bg-red-100 text-red-600'
                                                                }`}>
                                                                {latestReq.status === 'pending' ? 'Review Expected' : latestReq.status}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {subjects.length === 0 && (
                            <div className="text-center py-10">
                                <button
                                    onClick={handleSeedSubjects}
                                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                                >
                                    Seed Default Subjects
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FacultyCourseView;
