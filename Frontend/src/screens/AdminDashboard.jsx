import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, AlertCircle, Users, BookOpen, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../utils/UserContext';

const BentoCard = ({ children, className = "", delay = 0, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        onClick={onClick}
        className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
    >
        {children}
    </motion.div>
);

const StatCard = ({ title, value, colorClass, icon: Icon, onClick, delay }) => (
    <BentoCard
        delay={delay}
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center group ${colorClass.bg} ${onClick ? 'hover:scale-[1.03]' : ''}`}
    >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${colorClass.iconBg} group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon size={28} className={colorClass.text} />
        </div>
        <h3 className={`text-3xl font-black ${colorClass.text} mb-1`}>{value}</h3>
        <p className="text-secondary font-bold text-sm uppercase tracking-wide opacity-80">{title}</p>
    </BentoCard>
);

const RequestItem = ({ title, requestedBy, type, date, onApprove, onReject, onViewDetails }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${type === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                {type === 'New' ? 'N' : 'U'}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{requestedBy}</span>
                    <span>•</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onViewDetails} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="View Details">
                <FileText size={16} />
            </button>
            <button onClick={onApprove} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                <CheckCircle size={16} />
            </button>
            <button onClick={onReject} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                <XCircle size={16} />
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
                    <h3 className="text-xl font-extrabold text-gray-900">Review Request</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Type</label>
                            <p className="font-bold text-gray-900">{request.requestType}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Submitted By</label>
                            <p className="text-gray-900 font-medium">{request.facultyId?.firstName} {request.facultyId?.lastName}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Justification</label>
                        <p className="text-gray-700 p-4 bg-gray-50 rounded-2xl text-sm leading-relaxed border border-gray-100">{request.justification}</p>
                    </div>

                    {/* Dynamic Details based on Type */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                        <label className="text-accent-blue text-xs font-bold uppercase mb-3 block tracking-wider">Proposed Changes</label>
                        {(request.requestType === 'Add Unit' || request.requestType === 'Update Unit') ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Unit Number</span>
                                    <b className="text-gray-900">{proposedChanges.unitNumber}</b>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Hours</span>
                                    <b className="text-gray-900">{proposedChanges.unitHours} Hrs</b>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium block mb-1">Unit Title</span>
                                    <b className="text-gray-900 text-base">{proposedChanges.unitTitle}</b>
                                </div>
                            </div>
                        ) : request.requestType.includes('Topic') ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Target Unit</span>
                                    <b className="text-gray-900">Unit {proposedChanges.unitNumber}</b>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium block mb-1">Topic Name</span>
                                    <b className="text-gray-900 text-base">{proposedChanges.newTopic}</b>
                                </div>
                                {proposedChanges.description && (
                                    <div className="mt-3 pt-3 border-t border-blue-100">
                                        <span className="text-gray-600 font-medium block mb-1">
                                            {request.requestType.includes('Remove') ? 'Detail to Remove' : 'New Detail Content'}
                                        </span>
                                        <p className="text-gray-900 text-sm italic bg-white/50 p-3 rounded-lg border border-blue-100">
                                            "{proposedChanges.description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm">
                                <label className="text-gray-600 text-xs font-bold block mb-1">Description Update:</label>
                                <p className="font-medium text-gray-900 italic">"{proposedChanges.description}"</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => { onReject(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => { onApprove(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
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
                    <h3 className="text-xl font-extrabold text-gray-900">Respond to Student</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{query.subject}</h4>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{query.message}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">From: {query.studentId?.firstName} {query.studentId?.lastName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Response</label>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-white"
                                placeholder="Type your response here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-white"
                            >
                                <option value="resolved">Resolved</option>
                                <option value="reviewed">Reviewed (Needs Follow-up)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 rounded-xl bg-accent-blue text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
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
            // Could add toast here
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 font-medium">Overview of portal activity and pending actions.</p>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Courses"
                    value={loading ? "..." : stats.courses}
                    colorClass={{ bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', text: 'text-blue-600' }}
                    icon={BookOpen}
                    onClick={() => navigate('/admin/courses')}
                    delay={0.1}
                />
                <StatCard
                    title="Active Faculty"
                    value={loading ? "..." : stats.faculty}
                    colorClass={{ bg: 'bg-orange-50/50', iconBg: 'bg-orange-100', text: 'text-orange-600' }}
                    icon={Users}
                    delay={0.2}
                />
                <StatCard
                    title="Pending Requests"
                    value={loading ? "..." : stats.pending}
                    colorClass={{ bg: 'bg-yellow-50/50', iconBg: 'bg-yellow-100', text: 'text-yellow-600' }}
                    icon={AlertCircle}
                    delay={0.3}
                />
                <StatCard
                    title="Student Queries"
                    value={loading ? "..." : stats.studentQueries}
                    colorClass={{ bg: 'bg-green-50/50', iconBg: 'bg-green-100', text: 'text-green-600' }}
                    icon={MessageSquare}
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Approvals */}
                <BentoCard delay={0.5} className="lg:col-span-2 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{requests.length} pending</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 mb-4 shadow-sm">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">All Caught Up!</h4>
                            <p className="text-gray-500 text-sm">No pending curriculum updates.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map(req => (
                                <RequestItem
                                    key={req._id}
                                    title={`${req.requestType}: ${req.curriculumId?.title || 'Unknown Subject'}`}
                                    requestedBy={`Prof. ${req.facultyId?.firstName || 'Faculty'}`}
                                    type={req.requestType === 'Add Topic' ? 'New' : 'Update'}
                                    date={new Date(req.createdAt).toLocaleDateString()}
                                    onApprove={() => handleAction(req._id, 'approved')}
                                    onReject={() => handleAction(req._id, 'rejected')}
                                    onViewDetails={() => setSelectedRequest(req)}
                                />
                            ))}
                        </div>
                    )}
                </BentoCard>

                {/* Right Column Stack */}
                <div className="flex flex-col gap-6">
                    {/* Student Queries Preview */}
                    <BentoCard delay={0.6} className="flex-1 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <MessageSquare size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Student Queries</h3>
                            </div>
                            <button onClick={() => navigate('/admin/queries')} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-accent-blue hover:border-accent-blue transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Loading...</div>
                        ) : studentQueries.filter(q => q.status === 'pending').length === 0 ? (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-gray-900 font-bold">No Pending Queries</p>
                                <p className="text-gray-500 text-xs">All caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {studentQueries.filter(q => q.status === 'pending').slice(0, 3).map(query => (
                                    <div key={query._id} onClick={() => setSelectedQuery(query)} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-accent-blue transition-colors">{query.subject}</h4>
                                            <Clock size={12} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-xs line-clamp-2 mb-2">{query.message}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                {query.studentId?.firstName?.[0] || 'S'}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{query.studentId?.firstName}</span>
                                        </div>
                                    </div>
                                ))}
                                {studentQueries.filter(q => q.status === 'pending').length > 3 && (
                                    <button onClick={() => navigate('/admin/queries')} className="text-center w-full text-xs font-bold text-gray-400 hover:text-accent-blue py-2">
                                        + {studentQueries.filter(q => q.status === 'pending').length - 3} more queries
                                    </button>
                                )}
                            </div>
                        )}
                    </BentoCard>

                    {/* System Report (Smaller) */}
                    <BentoCard delay={0.7} className="bg-accent-blue text-white overflow-hidden relative group cursor-pointer hover:shadow-lg hover:shadow-blue-500/20" onClick={() => { }}>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-1">System Report</h3>
                                <p className="text-blue-100 text-xs font-medium">Generate compliance report</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <FileText size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                    </BentoCard>
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
                        } catch (error) {
                            console.error('Failed to respond:', error);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
