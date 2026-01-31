import React from 'react';

const getRoleBadgeColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return 'bg-accent-yellow text-white';
    case 'teacher':
    case 'faculty': return 'bg-accent-blue text-white';
    default: return 'bg-accent-green text-white';
  }
};

const MessageBubble = ({ msg, isMe, showAvatar, role, currentUserId, onDelete, onUserClick }) => {
  const roleColor = msg.role === 'Admin'
    ? 'text-accent-yellow'
    : (msg.role === 'Faculty' || msg.role === 'Teacher' ? 'text-accent-blue' : 'text-emerald-500');

  const handleUserClick = () => {
    if (onUserClick && msg.sender) {
      onUserClick(msg.sender);
    }
  };

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} group`}>
        <div 
          className={`w-10 h-10 rounded-[1rem] flex items-center justify-center text-sm font-black shrink-0 shadow-sm transition-transform hover:scale-110 ${showAvatar ? getRoleBadgeColor(msg.role) : 'opacity-0'} ${showAvatar && !isMe ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={showAvatar && !isMe ? handleUserClick : undefined}
          title={showAvatar && !isMe ? `View ${msg.sender?.firstName}'s profile` : undefined}
        >
          {msg.sender?.firstName?.[0] || 'U'}
        </div>

        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          {showAvatar && !isMe && (
            <span 
              className={`text-[10px] font-black uppercase tracking-wider mb-1 ml-1 ${roleColor} cursor-pointer hover:underline`}
              onClick={handleUserClick}
            >
              {msg.sender?.firstName} {msg.sender?.lastName} <span className="opacity-50">• {msg.role}</span>
            </span>
          )}

          <div className={`px-6 py-4 rounded-[1.5rem] text-sm md:text-base font-medium shadow-sm relative transition-all duration-200 hover:shadow-md leading-relaxed ${isMe
            ? 'bg-gradient-to-br from-accent-blue to-cyan-500 text-white rounded-tr-sm'
            : 'bg-white text-primary border border-gray-100 rounded-tl-sm'
            }`}>
            {msg.content}

            {role === 'admin' && (
              <button
                onClick={() => onDelete(msg)}
                className={`absolute -top-3 ${isMe ? '-left-3' : '-right-3'} opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg transition-all scale-75 hover:scale-100 z-10`}
                title="Delete Message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          <span className="text-[10px] font-bold text-gray-300 mt-1 px-2">
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
