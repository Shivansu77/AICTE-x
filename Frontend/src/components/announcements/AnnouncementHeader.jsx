import React from 'react';

const AnnouncementHeader = ({ image }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg overflow-hidden border border-black/5 bg-white">
      <img src={image} alt="Announcements" className="w-full h-full object-cover" />
    </div>
    <div>
      <h1 className="text-4xl font-extrabold text-primary">Announcements</h1>
      <p className="text-secondary font-medium">Implementation updates, events, and notices.</p>
    </div>
  </div>
);

export default AnnouncementHeader;
