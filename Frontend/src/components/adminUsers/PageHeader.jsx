import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ onBack }) => (
  <header className="mb-8">
    <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 mb-4 transition-colors">
      <ArrowLeft size={20} /> Back to Dashboard
    </button>
    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
      <div>
        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
        <p className="text-gray-500 font-medium mt-1">View and manage all registered users.</p>
      </div>
    </div>
  </header>
);

export default PageHeader;
