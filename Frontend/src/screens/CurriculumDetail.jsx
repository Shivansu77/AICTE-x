import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, FileText, Plus, ChevronDown, ChevronUp, Download, CheckCircle, Bell, X, Save, RotateCcw, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UnitCard from '../components/curriculum/UnitCard';

const CurriculumDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestData, setRequestData] = useState({ type: 'Bulk Update', justification: '', proposedChanges: null });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student';

    const [history, setHistory] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [draftUnits, setDraftUnits] = useState([]);
    const [draftCourse, setDraftCourse] = useState({
        title: '',
        description: '',
        credits: 0,
        courseOutcomes: []
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/curriculum/${id}`);
                setCourse(response.data);
                setDraftUnits(JSON.parse(JSON.stringify(response.data.units || []))); // Deep copy for draft
                setDraftCourse({
                    title: response.data.title || '',
                    description: response.data.description || '',
                    credits: response.data.credits || 0,
                    courseOutcomes: response.data.courseOutcomes || []
                });

                // Fetch History once course is loaded
                if (response.data && response.data.code) {
                    const histRes = await api.get(`/curriculum/history/code/${response.data.code}`);
                    setHistory(histRes.data);
                }

                // Fetch Requests
                if (role === 'teacher' || role === 'faculty') {
                    const reqRes = await api.get('/requests/my-requests');
                    setMyRequests(reqRes.data);
                }

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
            const payload = {
                courseId: course.courseId?._id || course.courseId,
                curriculumId: course._id,
                requestType: 'Bulk Update',
                justification: requestData.justification,
                proposedChanges: requestData.proposedChanges || {
                    ...draftCourse,
                    units: draftUnits,
                    description: "Full curriculum update proposed by faculty."
                }
            };

            await api.post('/requests', payload);
            alert("Request submitted successfully! Admin will review your changes.");
            setShowRequestModal(false);
            setRequestData({ type: 'Bulk Update', justification: '', proposedChanges: null });

            // Refresh requests
            const reqRes = await api.get('/requests/my-requests');
            setMyRequests(reqRes.data);

            // Refetch course data
            const courseRefresh = await api.get(`/curriculum/${id}`);
            setCourse(courseRefresh.data);

            // Refresh history
            if (courseRefresh.data && courseRefresh.data.code) {
                const histRes = await api.get(`/curriculum/history/code/${courseRefresh.data.code}`);
                setHistory(histRes.data);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to submit request.");
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(24, 119, 242); // Accent Blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text("AICTE Unified Model Curriculum", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text("Approved for All Affiliated Institutions", 105, 30, { align: 'center' });

        // Course Info
        doc.setTextColor(33, 33, 33);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(`${course.code}: ${course.title}`, 14, 55);

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Semester: ${course.semester}   |   Credits: ${course.credits}   |   Version: ${course.version}.0`, 14, 63);

        // Description
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const splitDescription = doc.splitTextToSize(course.description || '', 180);
        doc.text(splitDescription, 14, 70);

        const descHeight = splitDescription.length * 4; // Approx height
        let currentY = 70 + descHeight + 5;

        doc.setDrawColor(200, 200, 200);
        doc.line(14, currentY, 196, currentY);
        currentY += 10;

        // Outcomes
        if (course.courseOutcomes && course.courseOutcomes.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(24, 119, 242);
            doc.text("Course Outcomes", 14, currentY);

            const outcomesData = course.courseOutcomes.map(co => [co]);
            autoTable(doc, {
                startY: currentY + 5,
                body: outcomesData,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2 },
            });
            currentY = doc.lastAutoTable.finalY + 10;
        }

        // Syllabus Units
        doc.setFontSize(14);
        doc.setTextColor(24, 119, 242);
        doc.text("Detailed Syllabus", 14, currentY);

        const tableData = [];
        course.units.forEach(unit => {
            const topicsFormatted = unit.topics.map(topic => {
                let text = topic;
                if (unit.topicDetails && unit.topicDetails[topic] && unit.topicDetails[topic].length > 0) {
                    text += '\n  • ' + unit.topicDetails[topic].join('\n  • ');
                }
                return text;
            }).join('\n\n');
            tableData.push([`Unit ${unit.unitNumber}: ${unit.title} (${unit.hours} Hrs)`, topicsFormatted]);
        });

        autoTable(doc, {
            startY: currentY + 5,
            head: [['Unit Title', 'Topics Covered']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [24, 119, 242], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 4, overflow: 'linebreak' },
            columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } },
        });

        // References (if any)
        if (course.references && course.references.length > 0) {
            let refY = doc.lastAutoTable.finalY + 10;
            // Check for page break
            if (refY > 250) {
                doc.addPage();
                refY = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(24, 119, 242);
            doc.text("References / Textbooks", 14, refY);

            const refData = course.references.map(ref => [ref]);
            autoTable(doc, {
                startY: refY + 5,
                body: refData,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2 },
            });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            const dateStr = course.publishedAt ? new Date(course.publishedAt).toLocaleDateString() : new Date().toLocaleDateString();
            doc.text(`Generated on ${new Date().toLocaleDateString()} | Syllabus Ver ${course.version}.0 (${dateStr}) - AICTE Unified Portal`, 105, 290, { align: 'center' });
        }

        doc.save(`${course.code}_Syllabus_v${course.version}.pdf`);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-500 dark:text-gray-400">Loading Details...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen font-bold text-red-500">{error}</div>;
    if (!course) return <div className="flex items-center justify-center min-h-screen font-bold text-gray-500 dark:text-gray-400">Course not found.</div>;

    const filteredRequests = myRequests.filter(r =>
        (r.courseId && course.courseId && r.courseId._id === course.courseId._id) || // If populate matches
        (r.courseId === course.courseId) // If flat ID matches
    );

    return (
        <div className="max-w-4xl mx-auto relative pb-20">
            <Link to={-1} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ArrowLeft size={20} /> Back to Courses
            </Link>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-black/5 dark:border-gray-700 mb-8 relative">
                {/* Decorative Background - Clipped */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/30">
                            {course.code}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30">
                            Semester {course.semester}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 flex items-center gap-1">
                            <Clock size={12} /> {course.credits} Credits
                        </span>
                        {course.isLatest ? (
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 uppercase flex items-center gap-1">
                                <CheckCircle size={12} /> Latest Approved
                            </span>
                        ) : (
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 uppercase flex items-center gap-1">
                                <Clock size={12} /> V{course.version}.0 (Archived)
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 leading-tight">{course.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">
                        {course.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                        <button
                            onClick={generatePDF}
                            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Download size={20} /> Download Syllabus PDF
                        </button>

                        {/* Faculty Edit Mode Toggle */}
                        {(role === 'teacher' || role === 'faculty' || role === 'admin') && course.isLatest && (
                            <button
                                onClick={() => {
                                    setDraftUnits(JSON.parse(JSON.stringify(course.units || [])));
                                    setDraftCourse({
                                        title: course.title || '',
                                        description: course.description || '',
                                        credits: course.credits || 0,
                                        courseOutcomes: course.courseOutcomes || []
                                    });
                                    setShowEditModal(true);
                                }}
                                className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 font-bold py-3 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                            >
                                <Edit2 size={20} /> Edit Curriculum
                            </button>
                        )}

                        {/* Notification Bell */}
                        {(role === 'teacher' || role === 'faculty') && (
                            <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 font-bold p-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 transition-all active:scale-95 relative"
                                    >
                                    <Bell size={20} />
                                    {myRequests.some(r => r.status !== 'pending') && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-700 rounded-full"></span>}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-50 animate-in slide-in-from-top-2">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Notifications</h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {myRequests.filter(r => r.status !== 'pending').map(req => (
                                                <div key={req._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-l-blue-500">
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-1">Request {req.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Your request for <b>{req.requestType}</b> was {req.status}.</p>
                                                </div>
                                            ))}
                                            {myRequests.filter(r => r.status !== 'pending').length === 0 && <p className="text-xs text-gray-500 dark:text-gray-400">No new notifications.</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Content */}
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Course Outcomes Section */}
                    {course.courseOutcomes && course.courseOutcomes.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-black/5 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle size={20} />
                                </div>
                                Course Outcomes
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {course.courseOutcomes.map((co, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-emerald-50/30 dark:bg-emerald-900/20 border border-emerald-100/50 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group">
                                        <span className="font-black text-emerald-900/10 dark:text-emerald-400/20 text-2xl group-hover:text-emerald-500/20 transition-colors">0{idx + 1}</span>
                                        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1">{co}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Units */}
                    <div>
                        <div className="flex items-center justify-between mb-6 pl-2">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <BookOpen className="text-orange-500" /> Course Units
                            </h2>
                            <span className="text-sm font-bold text-gray-400 dark:text-gray-500">{course.units?.length || 0} Units Total</span>
                        </div>

                        <div className="space-y-4">
                            {course.units && course.units.length > 0 ? (
                                course.units.map((unit, idx) => (
                                    <UnitCard
                                        key={idx}
                                        unitNumber={unit.unitNumber || idx + 1}
                                        {...unit}
                                        role={role}
                                        isEditing={false}
                                        onEdit={() => {}}
                                        onAddTopic={() => {}}
                                        onRemoveTopic={() => {}}
                                        onUpdateTopic={() => {}}
                                        onUpdateTopicDetail={() => {}}
                                        onAddSubtopic={() => {}}
                                        onRemoveSubtopic={() => {}}
                                        onUpdateSubtopic={() => {}}
                                    />
                                ))
                            ) : (
                                <div className="p-12 text-center bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No units defined yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Sticky Container */}
                <div className="w-full md:w-80 shrink-0">
                    <div className="sticky top-8 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-black/5 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-blue-500" />
                                Version History
                            </h3>
                            {history.length > 0 ? (
                                <div className="space-y-4 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                                    {history.map((ver) => (
                                        <div key={ver._id} className="relative z-10 pl-10">
                                            <div className={`absolute left-2 top-2 w-3.5 h-3.5 rounded-full border-2 ${ver._id === course._id ? 'bg-blue-500 border-white dark:border-gray-800 shadow-md ring-2 ring-blue-500/20' : 'bg-gray-200 dark:bg-gray-600 border-white dark:border-gray-800'}`}></div>

                                            <Link to={`/curriculum/${ver._id}`} className={`block p-3 rounded-xl transition-all ${ver._id === course._id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-sm font-bold ${ver._id === course._id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>
                                                        Version {ver.version}.0
                                                    </span>
                                                    {ver.isLatest && <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wide">Latest</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                                                    {ver.publishedAt ? new Date(ver.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Draft'}
                                                </p>
                                                {ver.updateLog && <p className="text-xs text-gray-400 dark:text-gray-500 italic line-clamp-1">"{ver.updateLog}"</p>}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No history available.</p>
                            )}
                        </div>

                        {/* My Requests Section */}
                        {(role === 'teacher' || role === 'faculty') && (
                            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-black/5 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-orange-500" />
                                    My Pending Requests
                                </h3>
                                <div className="space-y-3">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map(req => (
                                            <div key={req._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-black text-gray-800 dark:text-gray-100 line-clamp-1 uppercase tracking-wide">{req.requestType}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'approved' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                                                        req.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">"{req.justification}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">No active requests.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                            <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">Submit Curriculum Update</h2>
                            <button onClick={() => setShowRequestModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 dark:hover:text-red-300 transition-colors font-bold">
                                X
                            </button>
                        </div>
                        <form onSubmit={handleRaiseRequest} className="p-8 space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 mb-4">
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                    You are submitting a curriculum update request. Your changes will be reviewed by the admin before being applied.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Academic Justification *</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Why are these changes necessary? Explain the academic reasoning..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                    value={requestData.justification}
                                    onChange={e => setRequestData({ ...requestData, justification: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowRequestModal(false)}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Curriculum Modal - Full Form */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Edit Curriculum</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Make all your changes below and submit for review</p>
                            </div>
                            <button 
                                onClick={() => setShowEditModal(false)} 
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 dark:hover:text-red-300 transition-colors font-bold"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Basic Info Section */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-blue-500" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Subject Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                                            value={draftCourse.title}
                                            onChange={e => setDraftCourse({ ...draftCourse, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Description</label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 resize-none"
                                            value={draftCourse.description}
                                            onChange={e => setDraftCourse({ ...draftCourse, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Credits</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                                            value={draftCourse.credits}
                                            onChange={e => setDraftCourse({ ...draftCourse, credits: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Course Outcomes Section */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                        <CheckCircle size={20} className="text-emerald-500" />
                                        Course Outcomes
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setDraftCourse({ ...draftCourse, courseOutcomes: [...draftCourse.courseOutcomes, ''] })}
                                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Outcome
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {draftCourse.courseOutcomes.map((outcome, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <span className="shrink-0 w-8 h-10 flex items-center justify-center text-sm font-bold text-gray-400 dark:text-gray-500">
                                                {idx + 1}.
                                            </span>
                                            <input
                                                type="text"
                                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                                                value={outcome}
                                                onChange={e => {
                                                    const newOutcomes = [...draftCourse.courseOutcomes];
                                                    newOutcomes[idx] = e.target.value;
                                                    setDraftCourse({ ...draftCourse, courseOutcomes: newOutcomes });
                                                }}
                                                placeholder="Enter course outcome..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOutcomes = draftCourse.courseOutcomes.filter((_, i) => i !== idx);
                                                    setDraftCourse({ ...draftCourse, courseOutcomes: newOutcomes });
                                                }}
                                                className="shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {draftCourse.courseOutcomes.length === 0 && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No course outcomes. Click "Add Outcome" to add one.</p>
                                    )}
                                </div>
                            </div>

                            {/* Units Section */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                        <BookOpen size={20} className="text-orange-500" />
                                        Course Units
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDraftUnits([...draftUnits, {
                                                unitNumber: draftUnits.length + 1,
                                                title: '',
                                                hours: 0,
                                                topics: [],
                                                topicDetails: {}
                                            }]);
                                        }}
                                        className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Unit
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {draftUnits.map((unit, unitIdx) => (
                                        <div key={unitIdx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                                            {/* Unit Header */}
                                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-3">
                                                <GripVertical size={16} className="text-gray-400 dark:text-gray-500" />
                                                <span className="font-bold text-gray-800 dark:text-gray-100">Unit {unit.unitNumber || unitIdx + 1}</span>
                                                <div className="flex-1" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newUnits = draftUnits.filter((_, i) => i !== unitIdx);
                                                        // Renumber units
                                                        newUnits.forEach((u, i) => u.unitNumber = i + 1);
                                                        setDraftUnits(newUnits);
                                                    }}
                                                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Unit Body */}
                                            <div className="p-4 space-y-4">
                                                <div className="grid grid-cols-12 gap-3">
                                                    <div className="col-span-8">
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Unit Title</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                                                            value={unit.title}
                                                            onChange={e => {
                                                                const newUnits = [...draftUnits];
                                                                newUnits[unitIdx].title = e.target.value;
                                                                setDraftUnits(newUnits);
                                                            }}
                                                            placeholder="e.g. Introduction to Data Structures"
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Hours</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
                                                            value={unit.hours}
                                                            onChange={e => {
                                                                const newUnits = [...draftUnits];
                                                                newUnits[unitIdx].hours = parseInt(e.target.value) || 0;
                                                                setDraftUnits(newUnits);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Topics */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Topics</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newUnits = [...draftUnits];
                                                                if (!newUnits[unitIdx].topics) newUnits[unitIdx].topics = [];
                                                                newUnits[unitIdx].topics.push('');
                                                                setDraftUnits(newUnits);
                                                            }}
                                                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                                                        >
                                                            <Plus size={12} /> Add Topic
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(unit.topics || []).map((topic, topicIdx) => (
                                                            <div key={topicIdx} className="space-y-2">
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                                                                        value={topic}
                                                                        onChange={e => {
                                                                            const newUnits = [...draftUnits];
                                                                            const oldTopic = newUnits[unitIdx].topics[topicIdx];
                                                                            newUnits[unitIdx].topics[topicIdx] = e.target.value;
                                                                            // Update topicDetails key
                                                                            if (newUnits[unitIdx].topicDetails && newUnits[unitIdx].topicDetails[oldTopic]) {
                                                                                newUnits[unitIdx].topicDetails[e.target.value] = newUnits[unitIdx].topicDetails[oldTopic];
                                                                                delete newUnits[unitIdx].topicDetails[oldTopic];
                                                                            }
                                                                            setDraftUnits(newUnits);
                                                                        }}
                                                                        placeholder="Enter topic name..."
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newUnits = [...draftUnits];
                                                                            // Remove topic details too
                                                                            if (newUnits[unitIdx].topicDetails && newUnits[unitIdx].topicDetails[topic]) {
                                                                                delete newUnits[unitIdx].topicDetails[topic];
                                                                            }
                                                                            newUnits[unitIdx].topics.splice(topicIdx, 1);
                                                                            setDraftUnits(newUnits);
                                                                        }}
                                                                        className="shrink-0 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>

                                                                {/* Subtopics / Details */}
                                                                {topic && (
                                                                    <div className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-2">
                                                                        {(unit.topicDetails?.[topic] || []).map((detail, detailIdx) => (
                                                                            <div key={detailIdx} className="flex gap-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
                                                                                    value={detail}
                                                                                    onChange={e => {
                                                                                        const newUnits = [...draftUnits];
                                                                                        newUnits[unitIdx].topicDetails[topic][detailIdx] = e.target.value;
                                                                                        setDraftUnits(newUnits);
                                                                                    }}
                                                                                    placeholder="Sub-topic detail..."
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const newUnits = [...draftUnits];
                                                                                        newUnits[unitIdx].topicDetails[topic].splice(detailIdx, 1);
                                                                                        setDraftUnits(newUnits);
                                                                                    }}
                                                                                    className="shrink-0 w-6 h-6 rounded bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newUnits = [...draftUnits];
                                                                                if (!newUnits[unitIdx].topicDetails) newUnits[unitIdx].topicDetails = {};
                                                                                if (!newUnits[unitIdx].topicDetails[topic]) newUnits[unitIdx].topicDetails[topic] = [];
                                                                                newUnits[unitIdx].topicDetails[topic].push('');
                                                                                setDraftUnits(newUnits);
                                                                            }}
                                                                            className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1"
                                                                        >
                                                                            <Plus size={10} /> Add Detail
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {(!unit.topics || unit.topics.length === 0) && (
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">No topics yet</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {draftUnits.length === 0 && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No units defined. Click "Add Unit" to add one.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    setDraftUnits(JSON.parse(JSON.stringify(course.units || [])));
                                    setDraftCourse({
                                        title: course.title || '',
                                        description: course.description || '',
                                        credits: course.credits || 0,
                                        courseOutcomes: course.courseOutcomes || []
                                    });
                                }}
                                className="text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                <RotateCcw size={16} /> Reset Changes
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 px-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRequestData({ 
                                            type: 'Bulk Update', 
                                            justification: '', 
                                            proposedChanges: {
                                                ...draftCourse,
                                                units: draftUnits
                                            } 
                                        });
                                        setShowEditModal(false);
                                        setShowRequestModal(true);
                                    }}
                                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
                                >
                                    <Save size={18} /> Submit for Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurriculumDetail;
