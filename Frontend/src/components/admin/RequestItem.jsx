import React from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const RequestItem = ({ title, requestedBy, type, date, onApprove, onReject, onViewDetails }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${type === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                {type === 'New' ? 'N' : 'U'}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{requestedBy}</span>
                    <span>•</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onViewDetails} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="View Details">
                <FileText size={16} />
            </button>
            <button onClick={onApprove} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                <CheckCircle size={16} />
            </button>
            <button onClick={onReject} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                <XCircle size={16} />
            </button>
        </div>
    </div>
);

export default RequestItem;
