import React from 'react';
import { Shield } from 'lucide-react';

const SidebarHeader = ({ count }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-xl shadow-blue-900/5">
    <h2 className="text-2xl font-black text-primary flex items-center gap-2">
      <Shield className="text-accent-blue" /> Pending Approvals
    </h2>
    <p className="text-secondary font-medium text-sm mt-1">
      {count} changes awaiting AI verification
    </p>
  </div>
);

export default SidebarHeader;
