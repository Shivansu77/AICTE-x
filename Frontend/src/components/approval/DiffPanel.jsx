import React from 'react';

const DiffPanel = ({ selectedReq }) => (
  <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-8 font-mono text-sm">
    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 relative">
      <div className="absolute top-4 right-4 text-xs font-black text-red-300 uppercase tracking-widest">Original</div>
      <h5 className="font-bold text-red-900 mb-4 opacity-50">Current Curriculum</h5>
      <div className="space-y-2 opacity-60">
        <p>... (Existing content would appear here)</p>
        <p>Standard react hooks and lifecycle methods.</p>
        <div className="h-2 w-full bg-red-200/20 rounded"></div>
        <div className="h-2 w-2/3 bg-red-200/20 rounded"></div>
      </div>
    </div>
    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 relative">
      <div className="absolute top-4 right-4 text-xs font-black text-emerald-600 uppercase tracking-widest">Proposed</div>
      <h5 className="font-bold text-emerald-900 mb-4">Incoming Changes</h5>
      <div className="space-y-4">
        <div className="p-3 bg-emerald-100/50 rounded-lg text-emerald-800 border-l-4 border-emerald-500">
          <span className="font-bold block mb-1">+ New Topic Added</span>
          {typeof selectedReq.proposedChanges === 'string'
            ? selectedReq.proposedChanges
            : JSON.stringify(selectedReq.proposedChanges, null, 2)}
        </div>
        <div className="text-emerald-700/70 italic">
          "Industry Reference: {selectedReq.industryReference || 'Standard Update'}"
        </div>
      </div>
    </div>
  </div>
);

export default DiffPanel;
