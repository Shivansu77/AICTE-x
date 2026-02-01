import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatHeader = ({ activeChannel }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl text-white ${activeChannel === 'governance' ? 'bg-accent-yellow' : 'bg-accent-blue'}`}>
        <MessageCircle size={20} />
      </div>
      <div>
        <h3 className="font-extrabold text-primary dark:text-gray-100 text-lg">
          {activeChannel === 'governance' ? 'Governance Group' : 'Academic Group'}
        </h3>
        <p className="text-xs font-bold text-secondary dark:text-gray-400 opacity-60 uppercase tracking-wider">
          {activeChannel === 'governance' ? 'Admin & Faculty Only' : 'Faculty & Students'}
        </p>
      </div>
    </div>
    <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      Live
    </span>
  </div>
);

export default ChatHeader;
