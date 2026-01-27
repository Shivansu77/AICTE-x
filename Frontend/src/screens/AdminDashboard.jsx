import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Users, BookOpen, MessageSquare, ArrowRight, Clock, FileText } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import BentoCard from '../components/admin/BentoCard';
import StatCard from '../components/admin/StatCard';
import RequestItem from '../components/admin/RequestItem';
import RequestDetailsModal from '../components/admin/RequestDetailsModal';
import QueryResponseModal from '../components/admin/QueryResponseModal';

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
                    api.get('/requests/pending'),
                    api.get('/courses'),
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
            await api.put(`/requests/${id}/status`, { status });
            // Refresh Data
            const reqRes = await api.get('/requests/pending');
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
                    onClick={() => navigate('/admin/users')}
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
