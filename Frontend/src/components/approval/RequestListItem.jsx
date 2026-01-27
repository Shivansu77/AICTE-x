import React from 'react';
import { GitPullRequest, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const RequestListItem = ({ request, isSelected, onSelect, quickScore }) => (
  <motion.div
    layoutId={request._id}
    onClick={() => onSelect(request)}
    className={`p-5 rounded-[1.5rem] cursor-pointer border-2 transition-all relative overflow-hidden group ${isSelected
      ? 'bg-white border-accent-blue shadow-lg scale-[1.02]'
      : 'bg-white/50 border-transparent hover:bg-white hover:border-gray-100'
      }`}
  >
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <GitPullRequest size={64} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase font-black tracking-widest text-secondary">{request.requestType}</span>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${quickScore > 85 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
          <Zap size={10} fill="currentColor" /> {quickScore}% PRE-SCAN
        </div>
      </div>
      <h4 className="font-bold text-primary leading-tight mb-1 line-clamp-2">{request.justification}</h4>
      <p className="text-xs text-secondary font-medium">Requested by Faculty</p>
    </div>
  </motion.div>
);

export default RequestListItem;
