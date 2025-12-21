import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Send,
  X,
  User,
  Calendar
} from 'lucide-react';

const BentoCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label, colorClass, delay }) => (
  <BentoCard className={`flex flex-col items-center justify-center text-center group hover:scale-[1.02] ${colorClass.bg}`} delay={delay}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${colorClass.iconBg} group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={colorClass.text} />
    </div>
    <h3 className={`text-3xl font-black ${colorClass.text} mb-1`}>{value}</h3>
    <p className="text-secondary font-bold text-sm">{label}</p>
  </BentoCard>
);

const AdminQueries = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, reviewed

  useEffect(() => {
    fetchAllQueries();
  }, []);

  const fetchAllQueries = async () => {
    try {
      const response = await api.get('/user/student-queries');
      setQueries(response.data);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (queryId) => {
    setResponding(true);
    try {
      await api.put(`/user/student-query/${queryId}/respond`, { adminResponse: response, status: 'reviewed' });
      setResponse('');
      setSelectedQuery(null);
      fetchAllQueries();
    } catch (error) {
      console.error('Failed to respond:', error);
    } finally {
      setResponding(false);
    }
  };

  const updateStatus = async (queryId, status) => {
    try {
      await api.put(`/user/student-query/${queryId}/respond`, { status });
      fetchAllQueries();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredQueries = queries.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const stats = {
    total: queries.length,
    pending: queries.filter(q => q.status === 'pending').length,
    reviewed: queries.filter(q => q.status === 'reviewed' || q.status === 'processed').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Stats Section moved up, Header removed to avoid duplication with Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={MessageSquare}
          value={stats.total}
          label="Total Queries"
          colorClass={{ bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', text: 'text-blue-600' }}
          delay={0.1}
        />
        <StatCard
          icon={AlertCircle}
          value={stats.pending}
          label="Pending Action"
          colorClass={{ bg: 'bg-yellow-50/50', iconBg: 'bg-yellow-100', text: 'text-yellow-600' }}
          delay={0.2}
        />
        <StatCard
          icon={CheckCircle}
          value={stats.reviewed}
          label="Resolved"
          colorClass={{ bg: 'bg-green-50/50', iconBg: 'bg-green-100', text: 'text-green-600' }}
          delay={0.3}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'reviewed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f
                ? 'bg-accent-primary text-gray-900 bg-white shadow-md border border-gray-100'
                : 'text-gray-500 hover:bg-white hover:text-gray-700'
              }`}
          >
            {f} Queries
          </button>
        ))}
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <MessageSquare size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900">No queries found</h3>
            <p className="text-gray-500">There are no {filter !== 'all' ? filter : ''} queries to display.</p>
          </div>
        ) : (
          filteredQueries.map((query, idx) => (
            <BentoCard key={query._id} delay={0.1 * idx} className="group relative overflow-hidden">
              <div className="flex flex-col gap-4">

                {/* Header Row: Status & Category */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${query.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        query.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                      }`}>
                      {query.status === 'pending' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                      <span className="capitalize">{query.status}</span>
                    </span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-wider border border-gray-100">
                      {query.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      {query.studentId ? `${query.studentId.firstName} ${query.studentId.lastName}` : 'Unknown Student'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(query.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{query.subject}</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {query.message}
                  </p>
                </div>

                {/* Existing Admin Response Display */}
                {query.adminResponse && (
                  <div className="pl-4 border-l-4 border-accent-blue/30">
                    <p className="text-xs font-bold text-accent-blue mb-1">Pass Admin Response</p>
                    <p className="text-sm text-gray-700">{query.adminResponse}</p>
                  </div>
                )}

                {/* Actions Footer - Now horizontal */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50 mt-2">
                  {query.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(query._id, 'reviewed')}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (selectedQuery === query._id) {
                        setSelectedQuery(null);
                      } else {
                        setSelectedQuery(query._id);
                      }
                    }}
                    className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${selectedQuery === query._id
                        ? 'bg-gray-800 text-white'
                        : 'bg-accent-blue text-white hover:bg-blue-600 hover:-translate-y-0.5'
                      }`}
                  >
                    {selectedQuery === query._id ? <X size={16} /> : <Send size={16} />}
                    {selectedQuery === query._id ? 'Cancel' : 'Respond'}
                  </button>
                </div>
              </div>

              {/* Expandable Response Area */}
              <AnimatePresence>
                {selectedQuery === query._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="pt-4 bg-gray-50/50 -mx-6 -mb-6 p-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Draft Response</label>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-white shadow-sm mb-4"
                        placeholder="Type your official response..."
                        autoFocus
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedQuery(null)}
                          className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRespond(query._id)}
                          disabled={responding || !response.trim()}
                          className="px-6 py-2.5 bg-accent-blue text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                          {responding ? 'Sending...' : 'Send Response'}
                          {!responding && <Send size={16} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </BentoCard>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQueries;
