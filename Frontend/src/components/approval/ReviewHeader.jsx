import React from 'react';
import { Activity, Check, X } from 'lucide-react';

const ReviewHeader = ({ onApprove, onReject }) => (
  <div className="p-8 border-b border-gray-100 bg-white/50">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-black text-primary mb-2">Review Changes</h1>
        <div className="flex items-center gap-2 text-secondary font-medium text-sm">
          <Activity size={16} /> Impact Analysis: High Relevance
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onReject}
          className="px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <X size={18} /> Reject
        </button>
        <button
          onClick={onApprove}
          className="px-8 py-3 rounded-xl bg-accent-blue text-white font-bold shadow-lg shadow-accent-blue/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Check size={18} /> Approve Merge
        </button>
      </div>
    </div>
  </div>
);

export default ReviewHeader;
