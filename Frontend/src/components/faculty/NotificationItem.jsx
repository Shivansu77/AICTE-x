import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NotificationItem = ({ request }) => {
  const [expanded, setExpanded] = useState(false);

  const isPending = request.status === 'pending';
  const isApproved = request.status === 'approved';
  const colorClass = isPending ? 'bg-red-500' : (isApproved ? 'bg-blue-500' : 'bg-gray-400');
  const title = `Request ${request.status}: ${request.courseId?.code || 'Course'}`;
  const date = new Date(request.createdAt).toLocaleDateString();

  return (
    <div className="border-b border-gray-50 last:border-0 transition-all duration-300">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group select-none"
      >
        <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <span className="text-xs text-gray-400 font-medium">{date}</span>
        </div>
        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-10 pb-4 text-xs text-gray-500 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
          <p><span className="font-semibold text-gray-700">Type:</span> {request.requestType}</p>
          {request.justification && (
            <p className="leading-relaxed"><span className="font-semibold text-gray-700">Reason:</span> {request.justification}</p>
          )}
          {request.reviewComments && (
            <div className="bg-gray-50 p-3 rounded-xl mt-2 italic text-gray-600 border border-gray-100 shadow-sm relative">
              <span className="absolute top-2 left-2 text-2xl text-gray-200 leading-none">"</span>
              <span className="relative z-10 pl-2">{request.reviewComments}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
