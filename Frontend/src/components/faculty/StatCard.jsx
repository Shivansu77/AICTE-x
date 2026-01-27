import React from 'react';

const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-lg hover:border-gray-200 transition-all ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm ${color} ${onClick ? 'group-hover:scale-110' : ''} transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{label}</h3>
      <p className="text-3xl font-black text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;
