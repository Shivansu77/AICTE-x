import React from 'react';
import { Edit3, Trash2, Building2, Clock } from 'lucide-react';

const CourseCard = ({ course, index, onOpen, onEdit, onDelete }) => (
  <div
    onClick={() => onOpen(course._id)}
    className="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-500 cursor-pointer relative overflow-hidden border border-gray-100 hover:border-accent-blue/20"
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-blue/10 transition-colors"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-peach/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-accent-peach/10 transition-colors"></div>

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${index % 3 === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' :
          index % 3 === 1 ? 'bg-orange-50 text-orange-600 border-orange-100' :
            'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
          {course.code}
        </div>

        <div className="flex gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          <button
            onClick={(e) => onEdit(e, course)}
            className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 text-secondary hover:text-accent-blue hover:border-accent-blue/30 flex items-center justify-center transition-all"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => onDelete(e, course._id)}
            className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 text-secondary hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-black text-primary mb-2">{course.title}</h3>
      <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-4">
        <Building2 size={14} /> {course.department}
      </div>
      <p className="text-secondary font-medium leading-relaxed mb-6 line-clamp-2">{course.description || 'AICTE master course entry.'}</p>

      <div className="flex items-center justify-between text-xs font-bold text-secondary">
        <span className="flex items-center gap-2"><Clock size={14} /> {course.totalCredits} Credits</span>
        <span className="bg-accent-blue/10 text-accent-blue px-3 py-1.5 rounded-full uppercase">{course.type}</span>
      </div>
    </div>
  </div>
);

export default CourseCard;
