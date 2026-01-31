import React from 'react';
import { Shield, Sparkles, TriangleAlert, Timer } from 'lucide-react';

const SidebarHeader = ({ count, avgScore, highRisk, avgEta }) => (
  <div className="bg-white dark:bg-card border border-gray-100 dark:border-border-color p-5 rounded-2xl shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-primary flex items-center gap-2">
          <Shield className="text-accent-blue" /> AI Approvals
        </h2>
        <p className="text-secondary font-medium text-sm mt-1">
          {count} requests in review queue
        </p>
      </div>
      <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
        Live
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 mt-4">
      <div className="bg-slate-50 dark:bg-secondary/30 rounded-xl p-3 border border-slate-100 dark:border-border-color">
        <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
          <Sparkles size={13} /> Avg Score
        </div>
        <div className="text-lg font-black text-primary mt-1">{avgScore}</div>
      </div>
      <div className="bg-slate-50 dark:bg-secondary/30 rounded-xl p-3 border border-slate-100 dark:border-border-color">
        <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
          <TriangleAlert size={13} /> High Risk
        </div>
        <div className="text-lg font-black text-primary mt-1">{highRisk}</div>
      </div>
      <div className="bg-slate-50 dark:bg-secondary/30 rounded-xl p-3 border border-slate-100 dark:border-border-color">
        <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
          <Timer size={13} /> Avg ETA
        </div>
        <div className="text-lg font-black text-primary mt-1">{avgEta}</div>
      </div>
    </div>
  </div>
);

export default SidebarHeader;
