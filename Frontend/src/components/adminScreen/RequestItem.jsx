import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const RequestItem = ({ title, requestedBy, type, date }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow font-bold">
        {type === 'New' ? 'N' : 'U'}
      </div>
      <div>
        <h4 className="font-bold text-primary">{title}</h4>
        <p className="text-xs text-secondary font-medium">By {requestedBy} • {date}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors" title="Approve">
        <CheckCircle size={18} />
      </button>
      <button className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Reject">
        <XCircle size={18} />
      </button>
    </div>
  </div>
);

export default RequestItem;
