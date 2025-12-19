import React, { useState, useEffect } from 'react';
import { Book, Plus, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyScreen = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Master Courses to let faculty choose which one they teach
        // In a real app, this might be filtered by what is assigned to them.
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/api/courses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setCourses(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
                    <p className="text-gray-500">Select a course program to view and request updates for subjects.</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Faculty Access
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                {course.code}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-6">{course.department}</p>

                        <button
                            onClick={() => navigate(`/faculty/course/${course._id}`)}
                            className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            View Curriculum <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No active course programs found.</p>
                    <button
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem('token');
                                await fetch('http://localhost:8000/api/curriculum/seed', {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                window.location.reload();
                            } catch (e) { console.error(e); }
                        }}
                        className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                    >
                        Seed Demo Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default FacultyScreen;
