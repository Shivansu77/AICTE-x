import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ searchTerm, setSearchTerm, filterRole, setFilterRole }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
    <div className="relative flex-1 w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search by name or email..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
      {['all', 'student', 'teacher', 'admin'].map(role => (
        <button
          key={role}
          onClick={() => setFilterRole(role)}
          className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filterRole === role
            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
        >
          {role === 'teacher' ? 'Faculty' : role}
        </button>
      ))}
    </div>
  </div>
);

export default FilterBar;
