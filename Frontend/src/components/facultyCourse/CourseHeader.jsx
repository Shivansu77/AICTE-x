import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CourseHeader = ({ code, title, onBack }) => (
  <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
      <ArrowLeft className="w-6 h-6" />
    </button>
    <div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{code}</span>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  </header>
);

export default CourseHeader;
