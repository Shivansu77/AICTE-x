import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, History, Clock, CheckCircle } from 'lucide-react';
import BentoCard from './BentoCard';

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

const QueryHistoryCard = ({ queries }) => (
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
);

export default QueryHistoryCard;
