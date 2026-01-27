import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsightCard = ({ analyzing, aiData }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4 min-h-[100px] transition-all">
    <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-blue shadow-sm ${analyzing ? 'animate-pulse' : ''}`}>
      <Zap size={24} fill="currentColor" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-primary">AI Compliance Check</h4>
      {analyzing ? (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-secondary font-medium">Analyzing with Gemini AI...</span>
        </div>
      ) : aiData ? (
        <>
          <p className="text-sm text-secondary font-medium mt-1">
            {aiData.reason}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Confidence Score:</span>
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiData.score}%` }}
                className={`h-full ${aiData.score > 80 ? 'bg-emerald-500' : aiData.score > 50 ? 'bg-orange-500' : 'bg-red-500'}`}
              />
            </div>
            <span className="font-black text-primary">{aiData.score}/100</span>
          </div>
        </>
      ) : (
        <p className="text-sm text-secondary">Detailed analysis unavailable.</p>
      )}
    </div>
  </div>
);

export default AIInsightCard;
