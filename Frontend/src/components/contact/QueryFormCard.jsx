import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, AlertCircle, HelpCircle, Send } from 'lucide-react';
import BentoCard from './BentoCard';

const QueryFormCard = ({ queryForm, setQueryForm, handleSubmitQuery, loading, message }) => (
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
);

export default QueryFormCard;
