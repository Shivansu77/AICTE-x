import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ManageHeader from '../components/manageCourses/ManageHeader';
import CourseFormModal from '../components/manageCourses/CourseFormModal';
import CourseCard from '../components/manageCourses/CourseCard';

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
            <ManageHeader
                onBack={() => navigate('/')}
                onNew={openNewModal}
            />

            <main className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-2 -mr-2">
                {/* Modal Overlay */}
                <CourseFormModal
                    showForm={showForm}
                    editingId={editingId}
                    formData={formData}
                    setFormData={setFormData}
                    handleCreateOrUpdateCourse={handleCreateOrUpdateCourse}
                    setShowForm={setShowForm}
                />

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
                            <CourseCard
                                key={course._id}
                                course={course}
                                index={idx}
                                onOpen={(id) => navigate(`/admin/course/${id}`)}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageCourses;
