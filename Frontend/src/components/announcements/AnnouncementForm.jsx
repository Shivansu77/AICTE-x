import React from 'react';

const AnnouncementForm = ({ announcement, setAnnouncement, posting, handlePostAnnouncement }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm mb-8">
    <h3 className="text-lg font-bold text-primary mb-4">Post New Announcement</h3>
    <form onSubmit={handlePostAnnouncement} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Announcement Title (e.g. Hackathon 2025)"
          className="w-full bg-gray-50 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-xl py-3 px-4 font-bold text-primary outline-none transition-all"
          value={announcement.title}
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
          required
        />
        <div className="flex gap-4">
          <select
            className="bg-gray-50 border-2 border-transparent focus:border-accent-peach rounded-xl py-3 px-4 font-bold text-secondary outline-none cursor-pointer flex-1"
            value={announcement.type}
            onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value })}
          >
            <option value="info">Info</option>
            <option value="alert">Alert</option>
            <option value="success">Success</option>
          </select>
          <button
            type="submit"
            disabled={posting}
            className="flex-1 bg-accent-peach text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {posting ? 'Posting...' : 'Broadcast'}
          </button>
        </div>
      </div>
      <textarea
        placeholder="Details about the event or policy..."
        className="w-full bg-gray-50 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all resize-none h-24"
        value={announcement.content}
        onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
        required
      ></textarea>
    </form>
  </div>
);

export default AnnouncementForm;
