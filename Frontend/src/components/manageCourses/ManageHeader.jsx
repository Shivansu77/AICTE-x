import React from 'react';
import { ArrowLeft, GraduationCap, Plus } from 'lucide-react';

const ManageHeader = ({ onBack, onNew }) => (
  <div className="flex flex-col md:flex-row items-end justify-between mb-10 shrink-0 gap-6">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-[2.5rem] overflow-hidden shadow-xl shadow-accent-blue/20 hover:rotate-6 transition-transform border-4 border-accent-blue/30">
        <img 
          src="/curriculum.jpg" 
          alt="Curriculum" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full bg-gradient-to-br from-accent-blue to-cyan-500 items-center justify-center text-white">
          <GraduationCap size={40} />
        </div>
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
