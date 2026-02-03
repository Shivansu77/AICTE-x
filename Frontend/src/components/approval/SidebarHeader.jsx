import React from 'react';
import { Shield, Sparkles, TriangleAlert, Timer, Bot, BookOpen } from 'lucide-react';

const SidebarHeader = ({ count, avgScore, highRisk, avgEta }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-5 rounded-2xl shadow-xl">
    {/* Decorative glows */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"></div>
    
    <div className="relative flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Bot Image */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-blue-400/50 shadow-lg">
            <img 
              src="/bot.jpg" 
              alt="AI Bot" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
          </div>
          {/* Status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse"></div>
        </div>
        
        {/* Curriculum Image */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-amber-400/50 shadow-lg">
            <img 
              src="/curriculum.jpg" 
              alt="Curriculum" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="min-w-0">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            AI Approvals
          </h2>
          <p className="text-slate-400 font-medium text-xs">
            {count} requests in queue
          </p>
        </div>
      </div>
      <div className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse shrink-0">
        Live
      </div>
    </div>

    <div className="relative grid grid-cols-3 gap-2 mt-4">
      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-2.5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
          <Sparkles size={11} className="text-blue-400" /> Avg Score
        </div>
        <div className="text-base font-black text-white mt-0.5">{avgScore}</div>
      </div>
      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-2.5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
          <TriangleAlert size={11} className="text-amber-400" /> High Risk
        </div>
        <div className="text-base font-black text-white mt-0.5">{highRisk}</div>
      </div>
      <div className="bg-slate-800/60 backdrop-blur rounded-xl p-2.5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
          <Timer size={11} className="text-emerald-400" /> Avg ETA
        </div>
        <div className="text-base font-black text-white mt-0.5">{avgEta}</div>
      </div>
    </div>
  </div>
);

export default SidebarHeader;
