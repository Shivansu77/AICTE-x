import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import { motion } from 'framer-motion';
import { Send, MessageSquare, History, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

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

const ContactAdministration = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState([]);
  const [queryForm, setQueryForm] = useState({
    subject: '',
    message: '',
    category: 'general_query'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyQueries();
  }, []);

  const fetchMyQueries = async () => {
    try {
      const response = await api.get('/user/my-queries');
      setQueries(response.data);
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/user/student-query', queryForm);
      setMessage('Query submitted successfully!');
      setQueryForm({ subject: '', message: '', category: 'general_query' });
      fetchMyQueries();
    } catch (error) {
      setMessage('Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-700 border-green-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return <CheckCircle size={14} />;
      case 'reviewed': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-gray-900 mb-2">Student Support</h1>
        <p className="text-gray-600">Have a question? We're here to help. Track your queries and get responses directly from the administration.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Submission Form */}
        <BentoCard className="lg:col-span-2 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">New Query</h2>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              {message.includes('successfully') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmitQuery} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ">Subject</label>
              <input
                type="text"
                value={queryForm.subject}
                onChange={(e) => setQueryForm({ ...queryForm, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-gray-50/50 focus:bg-white"
                placeholder="e.g., Curriculum Update Request"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={queryForm.category}
                  onChange={(e) => setQueryForm({ ...queryForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="general_query">General Query</option>
                  <option value="subject_request">subject Request</option>
                  <option value="technical_issue">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
                <HelpCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Detailed Message</label>
              <textarea
                value={queryForm.message}
                onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-gray-50/50 focus:bg-white resize-none"
                placeholder="Please describe your issue or request in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-accent-blue text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Submit Query
                </>
              )}
            </button>
          </form>
        </BentoCard>

        {/* Right Column: Query History */}
        <div className="lg:col-span-3 space-y-6">
          <BentoCard delay={0.2} className="min-h-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent-peach/10 flex items-center justify-center text-accent-peach">
                <History size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Query History</h2>
            </div>

            {queries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No queries yet</h3>
                <p className="text-gray-500 max-w-xs mt-1">Status updates on your submitted queries will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.map((query, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    key={query._id}
                    className="group border border-gray-100 rounded-2xl p-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{query.subject}</h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{query.category.replace('_', ' ')}</span>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${getStatusColor(query.status)}`}>
                        {getStatusIcon(query.status)}
                        <span className="capitalize">{query.status}</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {query.message}
                    </p>

                    {query.adminResponse ? (
                      <div className="mt-4 pl-4 border-l-4 border-accent-blue/30">
                        <p className="text-xs font-bold text-accent-blue mb-1">Pass Admin Response</p>
                        <p className="text-sm text-gray-700">{query.adminResponse}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                        <Clock size={12} />
                        Waiting for response...
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(query.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

export default ContactAdministration;
