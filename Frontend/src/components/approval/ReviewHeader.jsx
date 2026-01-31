import React from 'react';
import { Activity, Check, X, BookOpen, User, Calendar } from 'lucide-react';

const ReviewHeader = ({ request, onApprove, onReject }) => (
  <div className="px-6 lg:px-8 py-6 border-b border-gray-100 bg-white/80">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400 font-black">AI Review Workspace</div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mt-1">
            {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-500 font-medium text-sm mt-2">
            <Activity size={14} /> Impact Analysis: High Relevance
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <X size={16} /> Reject
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2.5 rounded-xl bg-accent-blue text-white font-bold shadow-lg shadow-accent-blue/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Check size={16} /> Approve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Course</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 font-bold">
            <BookOpen size={14} /> {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Request Type</div>
          <div className="mt-1 text-gray-900 font-bold">{request?.requestType || 'Update'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Submitted By</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 font-bold">
            <User size={14} /> {request?.facultyId?.firstName || 'Faculty'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Submitted On</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 font-bold">
            <Calendar size={14} /> {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : '—'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewHeader;
