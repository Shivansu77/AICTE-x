import React from 'react';
import { ArrowLeft, GraduationCap, Zap, Plus } from 'lucide-react';

const ManageHeader = ({ onBack, onSeed, onNew }) => (
  <div className="flex flex-col md:flex-row items-end justify-between mb-10 shrink-0 gap-6">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-cyan-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-accent-blue/20 hover:rotate-6 transition-transform">
        <GraduationCap size={40} />
      </div>
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-secondary hover:text-primary font-bold text-sm mb-2 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        <h1 className="text-4xl font-black text-primary tracking-tight">Master Courses</h1>
        <p className="text-secondary font-medium text-lg">Manage AICTE-approved degree programs</p>
      </div>
    </div>

    <div className="flex gap-4">
      <button
        onClick={onSeed}
        className="bg-white text-primary px-7 py-4 rounded-full font-bold text-sm shadow-sm border border-gray-100 hover:shadow-md hover:translate-y-[-2px] transition-all flex items-center gap-2"
      >
        <Zap size={16} className="text-accent-yellow" /> Seed Defaults
      </button>
      <button
        onClick={onNew}
        className="bg-primary text-white px-9 py-4 rounded-full font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-2"
      >
        <Plus size={20} />
        <span>Add New Course</span>
      </button>
    </div>
  </div>
);

export default ManageHeader;
