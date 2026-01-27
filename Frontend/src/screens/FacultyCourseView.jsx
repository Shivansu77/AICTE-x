import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import CourseHeader from '../components/facultyCourse/CourseHeader';
import InfoBanner from '../components/facultyCourse/InfoBanner';
import SemesterSection from '../components/facultyCourse/SemesterSection';

const FacultyCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser(); // Get user for role check
    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFaculty = user?.role === 'teacher' || user?.role === 'faculty' || user?.role === 'admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get(`/courses/${id}`);
                setCourse(courseRes.data);

                // Fetch subjects
                try {
                    const subjectsRes = await api.get(`/curriculum/course/${id}`);
                    setSubjects(subjectsRes.data);
                } catch (subErr) {
                    console.error('Error fetching subjects:', subErr);
                    setSubjects([]);
                }

                // Fetch user's requests only if faculty
                if (isFaculty) {
                    try {
                        const requestsRes = await api.get('/requests/my-requests');
                        setRequests(requestsRes.data);
                    } catch (reqErr) {
                        console.warn('Error fetching requests or unauthorized:', reqErr);
                        setRequests([]);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching course:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [id, navigate, isFaculty]);

    const getRequestStatus = (subjectId) => {
        if (!isFaculty) return null; // Students don't see request status
        const subjectRequests = requests.filter(r => r.curriculumId?._id === subjectId || r.curriculumId === subjectId);
        if (subjectRequests.length === 0) return null;
        return subjectRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    };

    const handleSeedSubjects = async () => {
        try {
            await api.get('/curriculum/seed');
            window.location.reload();
        } catch (error) {
            alert('Failed to seed subjects');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!course) return <div className="p-10 text-center">Course not found</div>;

    const subjectsBySemester = subjects.reduce((acc, subject) => {
        acc[subject.semester] = acc[subject.semester] || [];
        acc[subject.semester].push(subject);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <CourseHeader code={course.code} title={course.title} onBack={() => navigate(-1)} />

                <main className="flex-1 overflow-y-auto p-8">
                    <InfoBanner isFaculty={isFaculty} />

                    <div className="space-y-8">
                        {Array.from({ length: course.totalSemesters }).map((_, idx) => {
                            const sem = idx + 1;
                            const semSubjects = subjectsBySemester[sem] || [];

                            return (
                                <SemesterSection
                                    key={sem}
                                    semester={sem}
                                    subjects={semSubjects}
                                    isFaculty={isFaculty}
                                    canSeed={subjects.length === 0 && idx === 2}
                                    onSeed={handleSeedSubjects}
                                    getRequestStatus={getRequestStatus}
                                    onOpenSubject={(id) => navigate(`/curriculum/${id}`)}
                                />
                            );
                        })}
                        {isFaculty && subjects.length === 0 && (
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
