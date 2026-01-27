import React from 'react';

const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-4">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-secondary font-bold text-sm uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-extrabold text-primary">{value}</p>
    </div>
  </div>
);

export default StatCard;
