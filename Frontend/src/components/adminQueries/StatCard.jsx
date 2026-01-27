import React from 'react';
import BentoCard from './BentoCard';

const StatCard = ({ icon: Icon, value, label, colorClass, delay }) => (
  <BentoCard className={`flex flex-col items-center justify-center text-center group hover:scale-[1.02] ${colorClass.bg}`} delay={delay}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${colorClass.iconBg} group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={colorClass.text} />
    </div>
    <h3 className={`text-3xl font-black ${colorClass.text} mb-1`}>{value}</h3>
    <p className="text-secondary font-bold text-sm">{label}</p>
  </BentoCard>
);

export default StatCard;
