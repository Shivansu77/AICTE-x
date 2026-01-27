import React from 'react';
import BentoCard from './BentoCard';

const StatCard = ({ icon: Icon, value, label, colorClass, delay }) => (
  <BentoCard className={`flex flex-col items-center justify-center text-center group hover:scale-[1.02] ${colorClass.bg}`} delay={delay}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${colorClass.iconBg} group-hover:scale-110 transition-transform`}>
      <Icon size={20} className={colorClass.text} />
    </div>
    <h3 className={`text-2xl font-black ${colorClass.text} mb-0.5`}>{value}</h3>
    <p className="text-secondary font-bold text-xs">{label}</p>
  </BentoCard>
);

export default StatCard;
