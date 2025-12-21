import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';

const AdminQueries = () => {
  const { user } = useUser();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

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

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading queries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Student Queries</h1>
        <span className="text-sm text-gray-500">{queries.length} total queries</span>
      </div>

      <div className="space-y-4">
        {queries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No queries submitted yet.</p>
          </div>
        ) : (
          queries.map((query) => (
            <div key={query._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{query.subject}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      query.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">Category: {query.category.replace('_', ' ')}</p>
                  <p className="text-gray-700 mb-3">{query.message}</p>
                  <p className="text-sm text-gray-500">
                    Submitted by {query.studentId ? `${query.studentId.firstName} ${query.studentId.lastName}` : 'Student'} on {new Date(query.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {query.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(query._id, 'reviewed')}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedQuery(selectedQuery === query._id ? null : query._id)}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    {selectedQuery === query._id ? 'Cancel' : 'Respond'}
                  </button>
                </div>
              </div>

              {query.adminResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Admin Response:</p>
                  <p className="text-sm text-gray-700">{query.adminResponse}</p>
                </div>
              )}

              {selectedQuery === query._id && (
                <div className="mt-4 border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your response here..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleRespond(query._id)}
                      disabled={responding || !response.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {responding ? 'Sending...' : 'Send Response'}
                    </button>
                    <button
                      onClick={() => setSelectedQuery(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQueries;
