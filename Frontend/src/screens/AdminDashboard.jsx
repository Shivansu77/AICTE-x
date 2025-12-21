import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, AlertCircle, Users, BookOpen, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ title, value, color, icon: Icon, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${onClick ? 'hover:scale-[1.02]' : ''}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-secondary font-bold text-sm uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-extrabold text-primary">{value}</p>
        </div>
    </div>
);

const RequestItem = ({ title, requestedBy, type, date, onApprove, onReject, onViewDetails }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow font-bold">
                {type === 'New' ? 'N' : 'U'}
            </div>
            <div>
                <h4 className="font-bold text-primary">{title}</h4>
                <p className="text-xs text-secondary font-medium">By {requestedBy} • {date}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={onApprove} className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Approve">
                <CheckCircle size={18} />
            </button>
            <button onClick={onReject} className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Reject">
                <XCircle size={18} />
            </button>
            <button onClick={onViewDetails} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors" title="View Details">
                <FileText size={18} />
            </button>
        </div>
    </div>
);

const RequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    if (!request) return null;
    const { proposedChanges } = request;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-primary">Review Request</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors font-bold">
                        X
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-secondary text-xs font-bold uppercase tracking-wider">Type</label>
                            <p className="font-bold text-lg text-primary">{request.requestType}</p>
                        </div>
                        <div>
                            <label className="text-secondary text-xs font-bold uppercase tracking-wider">Submitted By</label>
                            <p className="text-primary font-medium">{request.facultyId?.firstName} {request.facultyId?.lastName}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-secondary text-xs font-bold uppercase tracking-wider">Justification</label>
                        <p className="text-primary p-4 bg-gray-50 rounded-2xl mt-2 text-sm leading-relaxed border border-gray-100">{request.justification}</p>
                    </div>

                    {/* Dynamic Details based on Type */}
                    <div className="bg-accent-blue/5 p-5 rounded-2xl border border-accent-blue/10">
                        <label className="text-accent-blue text-xs font-bold uppercase mb-3 block tracking-wider">Proposed Changes</label>
                        {(request.requestType === 'Add Unit' || request.requestType === 'Update Unit') ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-accent-blue/10 pb-2">
                                    <span className="text-secondary font-medium">Unit Number</span>
                                    <b className="text-primary">{proposedChanges.unitNumber}</b>
                                </div>
                                <div className="flex justify-between border-b border-accent-blue/10 pb-2">
                                    <span className="text-secondary font-medium">Hours</span>
                                    <b className="text-primary">{proposedChanges.unitHours} Hrs</b>
                                </div>
                                <div>
                                    <span className="text-secondary font-medium block mb-1">Unit Title</span>
                                    <b className="text-primary text-base">{proposedChanges.unitTitle}</b>
                                </div>
                            </div>
                        ) : request.requestType.includes('Topic') ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-accent-blue/10 pb-2">
                                    <span className="text-secondary font-medium">Target Unit</span>
                                    <b className="text-primary">Unit {proposedChanges.unitNumber}</b>
                                </div>
                                <div>
                                    <span className="text-secondary font-medium block mb-1">Topic Name</span>
                                    <b className="text-primary text-base">{proposedChanges.newTopic}</b>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm">
                                <label className="text-secondary text-xs font-bold block mb-1">Description Update:</label>
                                <p className="font-medium text-primary italic">"{proposedChanges.description}"</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => { onReject(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-full bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => { onApprove(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1"
                        >
                            Approve Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ courses: 0, faculty: 0, pending: 0, studentQueries: 0 });
    const [requests, setRequests] = useState([]);
    const [studentQueries, setStudentQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Data in Parallel
                const [reqRes, courseRes, facultyRes, queryRes] = await Promise.all([
                    api.get('/api/requests/pending'),
                    api.get('/api/courses'),
                    api.get('/user/teachers'),
                    api.get('/user/student-queries')
                ]);

                setRequests(reqRes.data);
                setStudentQueries(queryRes.data);

                setStats({
                    courses: courseRes.data.length,
                    faculty: facultyRes.data.length,
                    pending: reqRes.data.length,
                    studentQueries: queryRes.data.filter(q => q.status === 'pending').length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/api/requests/${id}/status`, { status });
            // Refresh Data
            const reqRes = await api.get('/api/requests/pending');
            setRequests(reqRes.data);
            setStats(prev => ({ ...prev, pending: reqRes.data.length }));
            alert(`Request ${status} successfully!`);
        } catch (error) {
            console.error("Action failed", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Courses"
                    value={loading ? "..." : stats.courses}
                    color="bg-accent-blue"
                    icon={BookOpen}
                    onClick={() => navigate('/admin/courses')}
                />
                <StatCard title="Active Faculty" value={loading ? "..." : stats.faculty} color="bg-accent-peach" icon={Users} />
                <StatCard title="Pending Requests" value={loading ? "..." : stats.pending} color="bg-accent-yellow" icon={AlertCircle} />
                <StatCard title="Student Queries" value={loading ? "..." : stats.studentQueries} color="bg-accent-green" icon={MessageSquare} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Approvals */}
                <div className="bg-white/50 p-6 rounded-[2.5rem] border-2 border-white min-h-[400px]">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-2xl font-extrabold text-primary">Pending Approvals</h3>
                        <button className="text-accent-blue font-bold text-sm hover:underline">View All</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Loading Requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-600">All Caught Up!</h4>
                            <p className="text-gray-400 text-sm">No pending curriculum updates.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map(req => (
                                <div key={req._id}>
                                    <RequestItem
                                        title={`${req.requestType}: ${req.curriculumId?.title || 'Unknown Subject'}`}
                                        requestedBy={`Prof. ${req.facultyId?.firstName || 'Faculty'}`}
                                        type={req.requestType === 'Add Topic' ? 'New' : 'Update'}
                                        date={new Date(req.createdAt).toLocaleDateString()}
                                        onApprove={() => handleAction(req._id, 'approved')}
                                        onReject={() => handleAction(req._id, 'rejected')}
                                        onViewDetails={() => setSelectedRequest(req)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Student Queries */}
                <div className="bg-white/50 p-6 rounded-[2.5rem] border-2 border-white min-h-[400px]">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-2xl font-extrabold text-primary">Student Queries</h3>
                        <button className="text-accent-blue font-bold text-sm hover:underline">View All</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Loading Queries...</div>
                    ) : studentQueries.filter(q => q.status === 'pending').length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-600">No Pending Queries</h4>
                            <p className="text-gray-400 text-sm">All student queries have been addressed.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {studentQueries.filter(q => q.status === 'pending').map(query => (
                                <div key={query._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900">{query.subject}</h4>
                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{query.message}</p>
                                    <p className="text-xs text-gray-500">By {query.studentId?.firstName} {query.studentId?.lastName}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => setSelectedQuery(query)}
                                            className="text-blue-600 text-sm hover:text-blue-800"
                                        >
                                            Respond
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* System Activity / Recent Actions (Placeholder) */}
                <div className="bg-accent-blue/5 p-6 rounded-[2.5rem] border-2 border-white flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-accent-blue shadow-sm mb-4">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">System Reports</h3>
                    <p className="text-secondary max-w-xs mb-6">Generate detailed compliance reports for AICTE monitoring.</p>
                    <button className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all">
                        Download Report
                    </button>
                </div>
            </div>

            {selectedRequest && (
                <RequestDetailsModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={() => handleAction(selectedRequest._id, 'approved')}
                    onReject={() => handleAction(selectedRequest._id, 'rejected')}
                />
            )}

            {selectedQuery && (
                <QueryResponseModal
                    query={selectedQuery}
                    onClose={() => setSelectedQuery(null)}
                    onRespond={async (response, status) => {
                        try {
                            await api.put(`/user/student-query/${selectedQuery._id}/respond`, {
                                adminResponse: response,
                                status: status
                            });
                            // Refresh data
                            const queryRes = await api.get('/user/student-queries');
                            setStudentQueries(queryRes.data);
                            setStats(prev => ({
                                ...prev,
                                studentQueries: queryRes.data.filter(q => q.status === 'pending').length
                            }));
                            setSelectedQuery(null);
                            alert('Response sent successfully!');
                        } catch (error) {
                            console.error('Failed to respond:', error);
                            alert('Failed to send response');
                        }
                    }}
                />
            )}
        </div>
    );
};

const QueryResponseModal = ({ query, onClose, onRespond }) => {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('resolved');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRespond(response, status);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-primary">Respond to Student Query</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors font-bold">
                        X
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <h4 className="font-bold text-primary mb-2">{query.subject}</h4>
                        <p className="text-secondary text-sm mb-4">{query.message}</p>
                        <p className="text-xs text-gray-500">From: {query.studentId?.firstName} {query.studentId?.lastName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Type your response here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="resolved">Resolved</option>
                                <option value="reviewed">Reviewed (Needs Follow-up)</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
                            >
                                Send Response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
