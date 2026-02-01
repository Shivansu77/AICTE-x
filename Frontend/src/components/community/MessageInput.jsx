import React from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ activeChannel, newMessage, setNewMessage, handleSendMessage }) => (
  <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-700 transition-colors">
    <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-800 p-2 pr-3 rounded-[2rem] border border-gray-200 dark:border-gray-700 focus-within:border-accent-peach focus-within:ring-4 focus-within:ring-accent-peach/10 transition-all shadow-inner">
      <input
        type="text"
        placeholder={`Message #${activeChannel}...`}
        className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-6 font-medium text-primary dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={!newMessage.trim()}
        className="w-12 h-12 bg-accent-peach text-white rounded-full flex items-center justify-center shadow-lg shadow-accent-peach/30 hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer active:scale-95 shrink-0"
      >
        <Send size={20} className={newMessage.trim() ? "translate-x-0.5" : ""} />
      </button>
    </form>
  </div>
);

export default MessageInput;
