import React from 'react';
import { MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';

const MessageList = ({ loading, messages, activeChannel, currentUserId, role, onDelete, onUserClick, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-gray-50/50 dark:bg-secondary/30 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #23293a', maxHeight: '65vh' }}>
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-3 opacity-50">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    ) : messages.length === 0 ? (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <MessageCircle size={40} />
        </div>
        <p className="text-secondary font-bold text-lg">No messages yet.</p>
        <p className="text-secondary/60 text-sm">Be the first to start the conversation in #{activeChannel}!</p>
      </div>
    ) : (
      messages.map((msg, idx) => {
        const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
        const showAvatar = idx === 0 || messages[idx - 1].sender?._id !== msg.sender?._id;

        return (
          <MessageBubble
            key={msg._id}
            msg={msg}
            isMe={isMe}
            showAvatar={showAvatar}
            role={role}
            currentUserId={currentUserId}
            onDelete={onDelete}
            onUserClick={onUserClick}
            animationDirection="up"
          />
        );
      })
    )}
    <div ref={messagesEndRef} />
  </div>
);

// Custom scrollbar styles for iMessage look
// Add this to your global CSS if not already present:
// .custom-scrollbar::-webkit-scrollbar { width: 8px; background: transparent; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 8px; }
// .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #3b82f6 #23293a; }

export default MessageList;
