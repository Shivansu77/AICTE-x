import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import QueryFormCard from '../components/contact/QueryFormCard';
import QueryHistoryCard from '../components/contact/QueryHistoryCard';

const ContactAdministration = () => {
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
        <QueryFormCard
          queryForm={queryForm}
          setQueryForm={setQueryForm}
          handleSubmitQuery={handleSubmitQuery}
          loading={loading}
          message={message}
        />

        {/* Right Column: Query History */}
        <div className="lg:col-span-3 space-y-6">
          <QueryHistoryCard queries={queries} />
        </div>
      </div>
    </div>
  );
};

export default ContactAdministration;
