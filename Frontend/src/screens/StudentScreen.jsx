import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import api from '../utils/api';

const StudentScreen = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [queryForm, setQueryForm] = useState({
    subject: '',
    message: '',
    category: 'general_query'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || !user.role) {
      navigate('/login');
    } else {
      fetchMyQueries();
    }
  }, [user, navigate]);

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



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Profile Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Profile Information</h3>
                  <p className="text-blue-700 mt-2">Name: {user.firstName} {user.lastName}</p>
                  <p className="text-blue-700">Email: {user.email}</p>
                  <p className="text-blue-700">Role: {user.role}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Quick Actions</h3>
                  <div className="mt-2 space-y-2">
                    <button className="block w-full text-left text-green-700 hover:text-green-900 transition">
                      View Courses
                    </button>
                    <button className="block w-full text-left text-green-700 hover:text-green-900 transition">
                      Check Assignments
                    </button>
                    <button className="block w-full text-left text-green-700 hover:text-green-900 transition">
                      View Grades
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Query Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Administration</h2>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmitQuery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={queryForm.subject}
                    onChange={(e) => setQueryForm({...queryForm, subject: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief subject of your query"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={queryForm.category}
                    onChange={(e) => setQueryForm({...queryForm, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general_query">General Query</option>
                    <option value="subject_request">Subject Request</option>
                    <option value="technical_issue">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={queryForm.message}
                    onChange={(e) => setQueryForm({...queryForm, message: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your query in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Query'}
                </button>
              </form>
            </div>
          </div>

          {/* My Queries Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Queries</h2>

              {queries.length === 0 ? (
                <p className="text-gray-500">No queries submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {queries.map((query) => (
                    <div key={query._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{query.subject}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          query.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {query.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{query.message}</p>
                      <p className="text-sm text-gray-500">Category: {query.category.replace('_', ' ')}</p>
                      {query.adminResponse && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">Admin Response:</p>
                          <p className="text-sm text-gray-700">{query.adminResponse}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Submitted: {new Date(query.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentScreen;
