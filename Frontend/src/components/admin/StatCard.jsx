import React from 'react';
import BentoCard from './BentoCard';

const StatCard = ({ title, value, colorClass, icon: Icon, onClick, delay }) => (
    <BentoCard
        delay={delay}
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center group ${colorClass.bg} ${onClick ? 'hover:scale-[1.03]' : ''}`}
    >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${colorClass.iconBg} group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon size={28} className={colorClass.text} />
        </div>
        <h3 className={`text-3xl font-black ${colorClass.text} mb-1`}>{value}</h3>
        <p className="text-secondary font-bold text-sm uppercase tracking-wide opacity-80">{title}</p>
    </BentoCard>
);

export default StatCard;
