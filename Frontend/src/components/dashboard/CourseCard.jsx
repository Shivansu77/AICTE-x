import React from 'react';
import { Clock, Edit3, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ _id, title, code, credits, color, icon: Icon, description, role }) => {
  const colorClasses = {
    blue: "bg-accent-blue",
    peach: "bg-accent-peach",
    green: "bg-accent-green",
    yellow: "bg-accent-yellow"
  };

  const bgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${bgClass} shadow-sm`}>
          {code}
        </span>
        <span className="text-gray-500 text-sm font-semibold flex items-center gap-1.5">
          <Clock size={14} className="opacity-60" /> {credits} Credits
        </span>
      </div>

      <div className="flex gap-5 mb-6 flex-1">
        <div className={`shrink-0 w-16 h-16 ${bgClass}/10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon size={28} className="text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-accent-blue transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
        <Link
          to={`/curriculum/${_id}`}
          className="flex-1 py-2.5 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
          View Details
        </Link>

        {(role === 'teacher' || role === 'faculty') && (
          <Link
            to={`/curriculum/${_id}`}
            className={`flex-1 py-2.5 px-4 rounded-xl ${bgClass} text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group/btn`}
          >
            <Edit3 size={16} className="group-hover/btn:rotate-12 transition-transform" />
            Manage
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
