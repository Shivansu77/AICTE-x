import React from 'react';
import { Shield, Sparkles, TriangleAlert, Timer } from 'lucide-react';

const SidebarHeader = ({ count, avgScore, highRisk, avgEta }) => (
  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Shield className="text-accent-blue" /> AI Approvals
        </h2>
        <p className="text-gray-500 font-medium text-sm mt-1">
          {count} requests in review queue
        </p>
      </div>
      <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
        Live
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mt-4">
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <Sparkles size={13} /> Avg Score
        </div>
        <div className="text-lg font-black text-gray-900 mt-1">{avgScore}</div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <TriangleAlert size={13} /> High Risk
        </div>
        <div className="text-lg font-black text-gray-900 mt-1">{highRisk}</div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <Timer size={13} /> Avg ETA
        </div>
        <div className="text-lg font-black text-gray-900 mt-1">{avgEta}</div>
      </div>
    </div>
  </div>
);

export default SidebarHeader;
