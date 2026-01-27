import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

const SubjectCard = ({ subject, latestReq, onOpen }) => (
  <div
    className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-pointer bg-white relative overflow-hidden"
    onClick={onOpen}
  >
    <div className="flex justify-between items-start mb-3">
      <span className="font-mono text-xs font-bold text-gray-500">{subject.code}</span>
      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Active</span>
    </div>
    <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 h-12">{subject.title}</h4>

    <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
      <span className="flex items-center gap-1"><Clock size={12} /> {subject.credits} Credits</span>
      <span className="flex items-center gap-1"><BookOpen size={12} /> {subject.units?.length || 0} Units</span>
    </div>

    {latestReq && (
      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${latestReq.status === 'pending' ? 'bg-orange-100 text-orange-600' :
        latestReq.status === 'approved' ? 'bg-blue-100 text-blue-600' :
          'bg-red-100 text-red-600'
        }`}>
        {latestReq.status === 'pending' ? 'Review Expected' : latestReq.status}
      </div>
    )}
  </div>
);

export default SubjectCard;
