import React from 'react';
import { Zap, ShieldCheck, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsightCard = ({ analyzing, aiData, error, onRetry }) => {
  const score = typeof aiData?.score === 'number' ? aiData.score : null;
  const scoreClass = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : 'bg-orange-500';
  const verdict = score === null ? 'AI Pending' : score >= 85 ? 'Low Risk' : score >= 70 ? 'Moderate Risk' : 'High Risk';

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-accent-blue ${analyzing ? 'animate-pulse' : ''}`}>
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-black text-gray-900">AI Compliance Check</h4>
            <p className="text-xs text-gray-500 font-medium">Alignment & risk scan</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${score >= 85 ? 'bg-emerald-100 text-emerald-700' : score >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {verdict}
        </div>
      </div>

      {analyzing ? (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 font-medium">Analyzing with AI engine...</span>
        </div>
      ) : error ? (
        <div className="mt-2">
          <p className="text-sm text-red-600 font-medium">AI analysis failed: {error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Retry AI Analysis
            </button>
          )}
        </div>
      ) : aiData ? (
        <>
          <p className="text-sm text-gray-600 font-medium">
            {aiData.reason}
          </p>
          {score !== null && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>AI Score</span>
                <span>{score}/100</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className={`h-full ${scoreClass}`}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                <ShieldCheck size={13} /> Alignment
              </div>
              <p className="text-sm font-bold text-gray-900 mt-1">{aiData.alignment || 'Strong'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                <TriangleAlert size={13} /> Gaps
              </div>
              <p className="text-sm font-bold text-gray-900 mt-1">{aiData.gaps || 'Minor'}</p>
            </div>
          </div>
          {(aiData.comparison?.strengths?.length || aiData.comparison?.risks?.length || aiData.comparison?.missingTopics?.length) && (
            <div className="mt-4 space-y-3 text-xs text-gray-600">
              {aiData.comparison?.strengths?.length > 0 && (
                <div>
                  <div className="font-bold text-emerald-700 uppercase">Strengths</div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {aiData.comparison.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiData.comparison?.risks?.length > 0 && (
                <div>
                  <div className="font-bold text-orange-700 uppercase">Risks</div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {aiData.comparison.risks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiData.comparison?.missingTopics?.length > 0 && (
                <div>
                  <div className="font-bold text-red-700 uppercase">Missing Topics</div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {aiData.comparison.missingTopics.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500">AI analysis unavailable.</p>
      )}
    </div>
  );
};

export default AIInsightCard;
