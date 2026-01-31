import React from 'react';
import { GitPullRequest, Zap, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const RequestListItem = ({ request, isSelected, onSelect, quickScore }) => (
  <motion.div
    layoutId={request._id}
    onClick={() => onSelect(request)}
    className={`p-4 rounded-2xl cursor-pointer border transition-all relative overflow-hidden group ${isSelected
      ? 'bg-white border-blue-200 shadow-lg'
      : 'bg-white border-gray-100 hover:shadow-md hover:border-gray-200'
      }`}
  >
    <div className="absolute -top-6 -right-4 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
      <GitPullRequest size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
            {request.requestType || 'Update'}
          </span>
          <h4 className="font-black text-gray-900 leading-tight line-clamp-2">
            {request.curriculumId?.title || request.courseId?.title || 'Curriculum Update'}
          </h4>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${quickScore > 85 ? 'bg-emerald-100 text-emerald-700' : quickScore > 75 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          <Zap size={10} fill="currentColor" /> {quickScore}% AI
        </div>
      </div>

      <p className="text-xs text-gray-600 font-medium line-clamp-2">
        {request.justification || 'No justification provided.'}
      </p>

      <div className="flex items-center justify-between mt-4 text-[11px] text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <User size={12} /> {request.facultyId?.firstName || 'Faculty'}
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} /> {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  </motion.div>
);

export default RequestListItem;
