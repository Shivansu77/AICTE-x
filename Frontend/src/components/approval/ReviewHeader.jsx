import React from 'react';
import { Activity, Check, X, BookOpen, User, Calendar, FileText } from 'lucide-react';

const ReviewHeader = ({ request, onApprove, onReject }) => (
  <div className="px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-slate-50 to-white dark:from-gray-800 dark:to-gray-800">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-black">AI Review Workspace</div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">
            {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-sm mt-2">
            <Activity size={14} className="text-blue-500" /> Impact Analysis: High Relevance
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2 border border-red-100 dark:border-red-900/30"
          >
            <X size={16} /> Reject
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Check size={16} /> Approve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Course</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
            <BookOpen size={14} className="text-blue-500" /> {request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Request Type</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
            <FileText size={14} className="text-purple-500" /> {request?.requestType || 'Update'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Submitted By</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
            <User size={14} className="text-orange-500" /> {request?.facultyId?.firstName || 'Faculty'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Submitted On</div>
          <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold">
            <Calendar size={14} className="text-emerald-500" /> {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : '\u2014'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewHeader;
