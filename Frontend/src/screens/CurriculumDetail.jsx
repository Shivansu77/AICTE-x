import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, FileText, Plus, ChevronDown, ChevronUp, Download, CheckCircle, Bell, X, Save, RotateCcw, Edit2 } from 'lucide-react';
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
    const [draftUnits, setDraftUnits] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/curriculum/${id}`);
                setCourse(response.data);
                setDraftUnits(JSON.parse(JSON.stringify(response.data.units || []))); // Deep copy for draft

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
            let payload = {};

            if (requestData.type === 'Bulk Update') {
                payload = {
                    courseId: course.courseId?._id || course.courseId,
                    curriculumId: course._id,
                    requestType: 'Bulk Update',
                    justification: requestData.justification,
                    proposedChanges: {
                        units: draftUnits,
                        description: "Full curriculum update proposed by faculty."
                    }
                };
            } else {
                payload = {
                    courseId: course.courseId?._id || course.courseId,
                    curriculumId: course._id,
                    requestType: requestData.type,
                    justification: requestData.justification,
                    proposedChanges: {
                        description: requestData.description || requestData.proposedChanges,
                        unitNumber: requestData.unitNumber,
                        newTopic: requestData.newTopic,
                        unitTitle: requestData.unitTitle,
                        unitHours: requestData.unitHours
                    }
                };
            }

            await api.post('/requests', payload);
            alert("Request submitted successfully!");
            setShowRequestModal(false);

            if (requestData.type === 'Bulk Update') {
                setIsEditing(false);
                setRequestData({ type: 'Bulk Update', justification: '', proposedChanges: null });
            } else {
                setRequestData({ type: 'Update Content', justification: '', proposedChanges: '', unitNumber: '', newTopic: '' });
            }

            // Refresh requests
            const reqRes = await api.get('/requests/my-requests');
            setMyRequests(reqRes.data);

            // Refetch course data to show any new units or changes
            const courseRefresh = await api.get(`/curriculum/${id}`);
            setCourse(courseRefresh.data);

            // Refresh history as well
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

    if (loading) return <div className="flex items-center justify-center min-h-screen font-bold text-secondary">Loading Details...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen font-bold text-red-500">{error}</div>;
    if (!course) return <div className="flex items-center justify-center min-h-screen font-bold text-secondary">Course not found.</div>;

    const filteredRequests = myRequests.filter(r =>
        (r.courseId && course.courseId && r.courseId._id === course.courseId._id) || // If populate matches
        (r.courseId === course.courseId) // If flat ID matches
    );

    return (
        <div className="max-w-4xl mx-auto relative pb-20">
            <Link to={-1} className="inline-flex items-center gap-2 text-secondary font-bold mb-6 hover:text-accent-blue transition-colors">
                <ArrowLeft size={20} /> Back to Courses
            </Link>

            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 mb-8 relative">
                {/* Decorative Background - Clipped */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-accent-blue shadow-lg shadow-accent-blue/30">
                            {course.code}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-accent-blue bg-accent-blue/10">
                            Semester {course.semester}
                        </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-accent-peach bg-accent-peach/10 flex items-center gap-1">
                            <Clock size={12} /> {course.credits} Credits
                        </span>
                        {course.isLatest ? (
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100 uppercase flex items-center gap-1">
                                <CheckCircle size={12} /> Latest Approved
                            </span>
                        ) : (
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-orange-700 bg-orange-100 uppercase flex items-center gap-1">
                                <Clock size={12} /> V{course.version}.0 (Archived)
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-extrabold text-primary mb-4 leading-tight">{course.title}</h1>
                    <p className="text-secondary text-lg font-medium leading-relaxed max-w-2xl">
                        {course.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                        <button
                            onClick={generatePDF}
                            className="bg-accent-blue text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-accent-blue/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Download size={20} /> Download Syllabus PDF
                        </button>

                        {/* Faculty Edit Mode Toggle */}
                        {(role === 'teacher' || role === 'faculty' || role === 'admin') && course.isLatest && (
                            !isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-secondary border-2 border-secondary/10 font-bold py-3 px-6 rounded-full hover:bg-gray-50 hover:border-secondary/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                >
                                    <Edit2 size={20} /> Edit Curriculum
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setRequestData({ type: 'Bulk Update', justification: '', proposedChanges: null });
                                            setShowRequestModal(true);
                                        }}
                                        className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <CheckCircle size={20} /> Submit Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setDraftUnits(JSON.parse(JSON.stringify(course.units || []))); // Reset
                                        }}
                                        className="bg-red-50 text-red-500 border-2 border-red-100 font-bold py-3 px-6 rounded-full hover:bg-red-100 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <X size={20} /> Cancel
                                    </button>
                                </div>
                            )
                        )}

                        {/* Notification Bell */}
                        {(role === 'teacher' || role === 'faculty') && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="bg-white text-secondary border-2 border-secondary/10 font-bold p-3 rounded-full hover:bg-gray-50 hover:border-secondary/30 transition-all active:scale-95 relative"
                                >
                                    <Bell size={20} />
                                    {myRequests.some(r => r.status !== 'pending') && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in slide-in-from-top-2">
                                        <h4 className="font-bold text-primary mb-3">Notifications</h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {myRequests.filter(r => r.status !== 'pending').map(req => (
                                                <div key={req._id} className="p-3 bg-gray-50 rounded-xl border-l-4 border-l-accent-blue">
                                                    <p className="text-xs font-bold text-primary mb-1">Request {req.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                                                    <p className="text-xs text-secondary">Your request for <b>{req.requestType}</b> was {req.status}.</p>
                                                </div>
                                            ))}
                                            {myRequests.filter(r => r.status !== 'pending').length === 0 && <p className="text-xs text-secondary">No new notifications.</p>}
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
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckCircle size={20} />
                                </div>
                                Course Outcomes
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {course.courseOutcomes.map((co, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                                        <span className="font-black text-emerald-900/10 text-2xl group-hover:text-emerald-500/20 transition-colors">0{idx + 1}</span>
                                        <p className="text-primary/80 font-medium leading-relaxed pt-1">{co}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Units */}
                    <div>
                        <div className="flex items-center justify-between mb-6 pl-2">
                            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                                <BookOpen className="text-accent-peach" /> Course Units
                            </h2>
                            <span className="text-sm font-bold text-secondary/70">{course.units?.length || 0} Units Total</span>
                        </div>

                        <div className="space-y-4">
                            {(isEditing ? draftUnits : course.units) && (isEditing ? draftUnits : course.units).length > 0 ? (
                                (isEditing ? draftUnits : course.units).map((unit, idx) => (
                                    <UnitCard
                                        key={idx}
                                        unitNumber={unit.unitNumber || idx + 1}
                                        {...unit}
                                        role={role}
                                        isEditing={isEditing}
                                        onUpdateUnit={(updatedUnit) => {
                                            const newUnits = [...draftUnits];
                                            newUnits[idx] = { ...newUnits[idx], ...updatedUnit };
                                            setDraftUnits(newUnits);
                                        }}
                                        onEdit={() => {
                                            if (isEditing) return;
                                            setRequestData({ type: 'Update Unit', unitNumber: unit.unitNumber, unitTitle: unit.title, unitHours: unit.hours, justification: '', proposedChanges: '' });
                                            setShowRequestModal(true);
                                        }}
                                        onAddTopic={() => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                if (!newUnits[idx].topics) newUnits[idx].topics = [];
                                                newUnits[idx].topics.push("New Topic");
                                                setDraftUnits(newUnits);
                                            } else {
                                                setRequestData({ type: 'Add Topic', unitNumber: unit.unitNumber, newTopic: '', justification: '', proposedChanges: '' });
                                                setShowRequestModal(true);
                                            }
                                        }}
                                        onRemoveTopic={(topicOrIdx) => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                newUnits[idx].topics.splice(topicOrIdx, 1);
                                                setDraftUnits(newUnits);
                                            } else {
                                                setRequestData({ type: 'Remove Topic', unitNumber: unit.unitNumber, newTopic: topicOrIdx, justification: '', proposedChanges: '' });
                                                setShowRequestModal(true);
                                            }
                                        }}
                                        onUpdateTopic={(topicIdx, newVal) => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                const oldTopic = newUnits[idx].topics[topicIdx];
                                                newUnits[idx].topics[topicIdx] = newVal;

                                                // Update topicDetails key if it exists
                                                if (newUnits[idx].topicDetails && newUnits[idx].topicDetails[oldTopic]) {
                                                    newUnits[idx].topicDetails[newVal] = newUnits[idx].topicDetails[oldTopic];
                                                    delete newUnits[idx].topicDetails[oldTopic];
                                                }
                                                setDraftUnits(newUnits);
                                            }
                                        }}
                                        onUpdateTopicDetail={(topic) => {
                                            if (isEditing) return;
                                            setRequestData({ type: 'Add Topic Detail', unitNumber: unit.unitNumber, newTopic: topic, justification: '', description: '' });
                                            setShowRequestModal(true);
                                        }}
                                        onAddSubtopic={(topic) => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                if (!newUnits[idx].topicDetails) newUnits[idx].topicDetails = {};
                                                if (!newUnits[idx].topicDetails[topic]) newUnits[idx].topicDetails[topic] = [];
                                                newUnits[idx].topicDetails[topic].push("New Detail");
                                                setDraftUnits(newUnits);
                                            } else {
                                                setRequestData({ type: 'Add Topic Detail', unitNumber: unit.unitNumber, newTopic: topic, justification: '', description: '' });
                                                setShowRequestModal(true);
                                            }
                                        }}
                                        onRemoveSubtopic={(topic, subIdxOrSubtopic) => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                if (newUnits[idx].topicDetails && newUnits[idx].topicDetails[topic]) {
                                                    newUnits[idx].topicDetails[topic].splice(subIdxOrSubtopic, 1);
                                                }
                                                setDraftUnits(newUnits);
                                            } else {
                                                setRequestData({ type: 'Remove Topic Detail', unitNumber: unit.unitNumber, newTopic: topic, description: subIdxOrSubtopic, justification: 'Removing detail', proposedChanges: '' });
                                                setShowRequestModal(true);
                                            }
                                        }}
                                        onUpdateSubtopic={(topic, subIdx, newVal) => {
                                            if (isEditing) {
                                                const newUnits = [...draftUnits];
                                                if (newUnits[idx].topicDetails && newUnits[idx].topicDetails[topic]) {
                                                    newUnits[idx].topicDetails[topic][subIdx] = newVal;
                                                }
                                                setDraftUnits(newUnits);
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                                    <p className="text-secondary font-bold text-lg">No units defined yet.</p>
                                </div>
                            )}

                            {/* Add Unit Button */}
                            {course.isLatest && (role === 'teacher' || role === 'faculty' || role === 'admin') && (
                                <button
                                    onClick={() => {
                                        setRequestData({
                                            type: 'Add Unit',
                                            unitNumber: (course.units?.length || 0) + 1,
                                            unitTitle: '',
                                            unitHours: '',
                                            justification: '',
                                            proposedChanges: ''
                                        });
                                        setShowRequestModal(true);
                                    }}
                                    className="w-full py-5 mt-6 rounded-[2rem] border-2 border-dashed border-gray-200 text-secondary font-bold hover:border-accent-blue hover:text-accent-blue hover:bg-accent-blue/5 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-accent-blue group-hover:text-white flex items-center justify-center transition-colors">
                                        <Plus size={16} />
                                    </div>
                                    Add New Unit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Sticky Container */}
                <div className="w-full md:w-80 shrink-0">
                    <div className="sticky top-8 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-accent-blue" />
                                Version History
                            </h3>
                            {history.length > 0 ? (
                                <div className="space-y-4 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                    {history.map((ver) => (
                                        <div key={ver._id} className="relative z-10 pl-10">
                                            <div className={`absolute left-2 top-2 w-3.5 h-3.5 rounded-full border-2 ${ver._id === course._id ? 'bg-accent-blue border-white shadow-md ring-2 ring-accent-blue/20' : 'bg-gray-200 border-white'}`}></div>

                                            <Link to={`/curriculum/${ver._id}`} className={`block p-3 rounded-xl transition-all ${ver._id === course._id ? 'bg-accent-blue/5 border border-accent-blue/20' : 'hover:bg-gray-50'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-sm font-bold ${ver._id === course._id ? 'text-accent-blue' : 'text-primary'}`}>
                                                        Version {ver.version}.0
                                                    </span>
                                                    {ver.isLatest && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Latest</span>}
                                                </div>
                                                <p className="text-xs text-secondary font-medium mb-1">
                                                    {ver.publishedAt ? new Date(ver.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Draft'}
                                                </p>
                                                {ver.updateLog && <p className="text-xs text-secondary/70 italic line-clamp-1">"{ver.updateLog}"</p>}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-secondary text-sm">No history available.</p>
                            )}
                        </div>

                        {/* My Requests Section */}
                        {(role === 'teacher' || role === 'faculty') && (
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5">
                                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-accent-peach" />
                                    My Pending Requests
                                </h3>
                                <div className="space-y-3">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map(req => (
                                            <div key={req._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-black text-primary line-clamp-1 uppercase tracking-wide">{req.requestType}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-secondary/80 line-clamp-2 leading-relaxed">"{req.justification}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-secondary text-sm text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">No active requests.</p>
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
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-extrabold text-primary">Raise Concern / Update</h2>
                            <button onClick={() => setShowRequestModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors font-bold">
                                X
                            </button>
                        </div>
                        <form onSubmit={handleRaiseRequest} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Request Type</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                    value={requestData.type}
                                    onChange={e => setRequestData({ ...requestData, type: e.target.value })}
                                    disabled={requestData.type === 'Bulk Update'}
                                >
                                    {requestData.type === 'Bulk Update' && <option>Bulk Update</option>}
                                    <option>Update Content</option>
                                    <option>Add Topic</option>
                                    <option>Remove Topic</option>
                                    <option>Add Unit</option>
                                    <option>Update Unit</option>
                                    <option>Add Topic Detail</option>
                                    <option>Remove Topic Detail</option>
                                    <option>New Tool/Technology</option>
                                    <option>Outcome Improvement</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Conditional Inputs */}
                            {requestData.type === 'Bulk Update' ? (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                    <p className="text-sm text-blue-800 font-medium">
                                        You are submitting a full curriculum update based on your edits. Please provide a justification below.
                                    </p>
                                </div>
                            ) : (requestData.type === 'Add Topic' || requestData.type === 'Remove Topic') ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-secondary mb-2">Target Unit No.</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="e.g. 1"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                            value={requestData.unitNumber}
                                            onChange={e => setRequestData({ ...requestData, unitNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-secondary mb-2">
                                            {requestData.type === 'Add Topic' ? 'New Topic Name' : 'Topic to Remove'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={requestData.type === 'Add Topic' ? "e.g. React Hooks" : "Exact topic name"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                            value={requestData.newTopic}
                                            onChange={e => setRequestData({ ...requestData, newTopic: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (requestData.type === 'Add Topic Detail' || requestData.type === 'Remove Topic Detail') ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-secondary mb-2">Unit No.</label>
                                            <input
                                                type="number"
                                                required
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-500"
                                                value={requestData.unitNumber}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-secondary mb-2">Topic</label>
                                            <input
                                                type="text"
                                                required
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-500"
                                                value={requestData.newTopic}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-secondary mb-2">
                                            {requestData.type === 'Add Topic Detail' ? 'Detail to Add' : 'Detail to Remove'}
                                        </label>
                                        <textarea
                                            required
                                            rows="2"
                                            placeholder={requestData.type === 'Add Topic Detail' ? "e.g. In-depth cover of custom hooks" : "Detail text"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary resize-none"
                                            value={requestData.description || ''}
                                            onChange={e => setRequestData({ ...requestData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (requestData.type === 'Add Unit' || requestData.type === 'Update Unit') ? (
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-3">
                                        <label className="block text-sm font-bold text-secondary mb-2">Unit No.</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="#"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                            value={requestData.unitNumber}
                                            onChange={e => setRequestData({ ...requestData, unitNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-sm font-bold text-secondary mb-2">Hours</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="Hrs"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                            value={requestData.unitHours || ''}
                                            onChange={e => setRequestData({ ...requestData, unitHours: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label className="block text-sm font-bold text-secondary mb-2">Unit Title</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Advanced Graph Algorithms"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary"
                                            value={requestData.unitTitle || ''}
                                            onChange={e => setRequestData({ ...requestData, unitTitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : requestData.type === 'Update Content' ? (
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">New Course Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Enter the updated course description..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary resize-none"
                                        value={requestData.proposedChanges}
                                        onChange={e => setRequestData({ ...requestData, proposedChanges: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2">Proposed Changes / Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Describe the changes..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary resize-none"
                                        value={requestData.proposedChanges}
                                        onChange={e => setRequestData({ ...requestData, proposedChanges: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-secondary mb-2">Academic Justification</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Why is this change necessary?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none font-medium text-primary resize-none"
                                    value={requestData.justification}
                                    onChange={e => setRequestData({ ...requestData, justification: e.target.value })}
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
