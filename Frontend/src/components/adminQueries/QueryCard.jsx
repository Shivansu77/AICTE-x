import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, AlertCircle, Send, X, User, Calendar } from 'lucide-react';
import BentoCard from './BentoCard';

const QueryCard = ({
  query,
  index,
  selectedQuery,
  setSelectedQuery,
  response,
  setResponse,
  responding,
  handleRespond,
  updateStatus
}) => (
  <BentoCard delay={0.1 * index} className="group relative overflow-hidden">
    <div className="flex flex-col gap-4">
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

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{query.subject}</h3>
        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
          {query.message}
        </p>
      </div>

      {query.adminResponse && (
        <div className="pl-4 border-l-4 border-accent-blue/30">
          <p className="text-xs font-bold text-accent-blue mb-1">Pass Admin Response</p>
          <p className="text-sm text-gray-700">{query.adminResponse}</p>
        </div>
      )}

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
);

export default QueryCard;
