import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

import StatCard from '../components/adminQueries/StatCard';
import QueryCard from '../components/adminQueries/QueryCard';

const AdminQueries = () => {
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
            <QueryCard
              key={query._id}
              query={query}
              index={idx}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              response={response}
              setResponse={setResponse}
              responding={responding}
              handleRespond={handleRespond}
              updateStatus={updateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQueries;
