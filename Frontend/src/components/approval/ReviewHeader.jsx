import React from 'react';
import { Activity, Check, X, BookOpen, User, Calendar } from 'lucide-react';

const ReviewHeader = ({ request, onApprove, onReject }) => (
  <div className="px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-border-color bg-white/80 dark:bg-card/80">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-secondary font-black">AI Review Workspace</div>
          <h1 className="text-2xl lg:text-3xl font-black text-primary mt-1">
            {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-secondary font-medium text-sm mt-2">
            <Activity size={14} /> Impact Analysis: High Relevance
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
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
        <div className="bg-gray-50 dark:bg-secondary/30 rounded-xl p-4 border border-gray-100 dark:border-border-color">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">Course</div>
          <div className="mt-1 flex items-center gap-2 text-primary font-bold">
            <BookOpen size={14} /> {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-secondary/30 rounded-xl p-4 border border-gray-100 dark:border-border-color">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">Request Type</div>
          <div className="mt-1 text-primary font-bold">{request?.requestType || 'Update'}</div>
        </div>
        <div className="bg-gray-50 dark:bg-secondary/30 rounded-xl p-4 border border-gray-100 dark:border-border-color">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">Submitted By</div>
          <div className="mt-1 flex items-center gap-2 text-primary font-bold">
            <User size={14} /> {request?.facultyId?.firstName || 'Faculty'}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-secondary/30 rounded-xl p-4 border border-gray-100 dark:border-border-color">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">Submitted On</div>
          <div className="mt-1 flex items-center gap-2 text-primary font-bold">
            <Calendar size={14} /> {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : '\u2014'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewHeader;
