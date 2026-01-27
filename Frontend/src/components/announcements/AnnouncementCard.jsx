import React from 'react';
import { Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';

const getTypeStyles = (type) => {
  switch (type) {
    case 'alert': return 'bg-red-100 text-red-600 border-red-200';
    case 'success': return 'bg-green-100 text-green-600 border-green-200';
    default: return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'alert': return AlertCircle;
    case 'success': return CheckCircle;
    default: return Info;
  }
};

const AnnouncementCard = ({ announcement, role, onDelete }) => {
  const TypeIcon = getTypeIcon(announcement.type);

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 hover:translate-y-[-2px] transition-all relative group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 ${getTypeStyles(announcement.type)}`}>
              <TypeIcon size={12} /> {announcement.type}
            </span>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">
              <Calendar size={12} /> {new Date(announcement.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{announcement.title}</h3>
          <p className="text-secondary leading-relaxed">{announcement.content}</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
            title="Delete Announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
