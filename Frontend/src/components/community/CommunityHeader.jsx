import React from 'react';
import { Users } from 'lucide-react';

const CommunityHeader = ({ role, activeChannel, setActiveChannel }) => (
  <div className="flex flex-col md:flex-row items-center justify-between mb-8 shrink-0 gap-6">
    <div className="flex items-center gap-5">
      <div className="w-16 h-16 bg-gradient-to-br from-accent-peach to-orange-400 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-accent-peach/20 hover:scale-105 transition-transform">
        <Users size={32} />
      </div>
      <div>
        <h1 className="text-4xl font-black text-primary tracking-tight">Community</h1>
        <p className="text-secondary font-medium text-lg">Faculty & Student Engagement Hub.</p>
      </div>
    </div>

    {(role === 'teacher' || role === 'faculty') && (
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex relative">
        <button
          onClick={() => setActiveChannel('academic')}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeChannel === 'academic'
            ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 translate-y-[-2px]'
            : 'text-secondary hover:bg-gray-50'
            }`}
        >
          Academic
        </button>
        <button
          onClick={() => setActiveChannel('governance')}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeChannel === 'governance'
            ? 'bg-accent-yellow text-white shadow-lg shadow-accent-yellow/30 translate-y-[-2px]'
            : 'text-secondary hover:bg-gray-50'
            }`}
        >
          Governance
        </button>
      </div>
    )}
  </div>
);

export default CommunityHeader;
