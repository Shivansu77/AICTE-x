import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, FileText, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';

const UnitCard = ({ unitNumber, title, topics, hours }) => {
    const [isOpen, setIsOpen] = useState(true);


    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center mb-4 text-left group"
            >
                <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-accent-peach/10 text-accent-peach rounded-full flex items-center justify-center font-bold text-lg">
                        {unitNumber}
                    </span>
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent-blue transition-colors">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="text-secondary" /> : <ChevronDown className="text-secondary" />}
            </button>

            {isOpen && (
                <div className="pl-14">
                    <div className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                        <Clock size={16} /> {hours} Hours
                    </div>
                    <ul className="space-y-3">
                        {topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream transition-colors cursor-default">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-accent-blue/50 shrink-0"></div>
                                <span className="font-medium text-primary/80">{topic}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CurriculumDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestData, setRequestData] = useState({ type: 'Update Content', justification: '', proposedChanges: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student';

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Determine if ID is mongoID or Code. Backend supports both in different routes or logic
                // Here we assume ID if coming from new links, or Code from dashboard.
                // Let's rely on standard ID if possible.
                const response = await api.get(`/api/curriculum/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError(err.response?.data?.message || "Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleRaiseRequest = async (e) => {
        e.preventDefault();
        try {
            // Placeholder for API call
            alert(`Request Raised: ${requestData.type} - ${requestData.justification}`);
            setShowRequestModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-secondary">Loading Details...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen font-bold text-red-500">{error}</div>;
    if (!course) return <div className="flex items-center justify-center min-h-screen font-bold text-secondary">Course not found.</div>;

    return (
        <div className="max-w-4xl mx-auto relative">
            <Link to={-1} className="inline-flex items-center gap-2 text-secondary font-bold mb-6 hover:text-accent-blue transition-colors">
                <ArrowLeft size={20} /> Back
            </Link>

            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>

                <div className="relative">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-accent-blue">
                            {course.code}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-accent-blue bg-accent-blue/10">
                            Semester {course.semester}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-accent-peach bg-accent-peach/10 flex items-center gap-1">
                            <Clock size={12} /> {course.credits} Credits
                        </span>
                        {course.isLatest && <span className="px-4 py-1.5 rounded-full text-xs font-bold text-green-700 bg-green-100 uppercase">Latest Approved</span>}
                    </div>

                    <h1 className="text-4xl font-extrabold text-primary mb-4">{course.title}</h1>
                    <p className="text-secondary text-lg font-medium leading-relaxed max-w-2xl">
                        {course.description}
                    </p>

                    <div className="mt-8 flex gap-4">
                        {/* Only Faculty can see Request Change */}
                        {(role === 'teacher' || role === 'faculty') && (
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="bg-accent-peach text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                            >
                                <Plus size={20} /> Request Update
                            </button>
                        )}
                        <button
                            onClick={() => alert("Syllabus PDF download starting...")}
                            className="bg-white text-secondary border-2 border-secondary/10 font-bold py-3 px-6 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <FileText size={20} /> Download Syllabus
                        </button>
                    </div>
                </div>
            </div>

            {/* Units */}
            <h2 className="text-2xl font-bold text-primary mb-6 pl-2 flex items-center gap-2">
                <BookOpen className="text-accent-peach" /> Course Units
            </h2>

            <div className="space-y-4">
                {course.units && course.units.length > 0 ? (
                    course.units.map((unit, idx) => (
                        <UnitCard key={idx} unitNumber={unit.unitNumber || idx + 1} {...unit} />
                    ))
                ) : (
                    <p className="text-secondary pl-2">No units defined yet.</p>
                )}
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-extrabold text-primary">Raise Concern / Update</h2>
                            <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">X</button>
                        </div>
                        <form onSubmit={handleRaiseRequest} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Request Type</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                    value={requestData.type}
                                    onChange={e => setRequestData({ ...requestData, type: e.target.value })}
                                >
                                    <option>Update Content</option>
                                    <option>Add Topic</option>
                                    <option>Remove Topic</option>
                                    <option>New Tool/Technology</option>
                                    <option>Outcome Improvement</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Academic Justification</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Why is this change necessary?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                    value={requestData.justification}
                                    onChange={e => setRequestData({ ...requestData, justification: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Proposed Changes / Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Describe the changes..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                    value={requestData.proposedChanges}
                                    onChange={e => setRequestData({ ...requestData, proposedChanges: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="bg-accent-blue text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumDetail;
