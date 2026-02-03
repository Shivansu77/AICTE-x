import React from 'react';
import { Zap, ShieldCheck, TriangleAlert, Sparkles, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsightCard = ({ analyzing, aiData, error, onRetry }) => {
  const score = typeof aiData?.score === 'number' ? aiData.score : null;
  const scoreClass = score >= 85 ? 'from-emerald-500 to-green-400' : score >= 70 ? 'from-blue-500 to-cyan-400' : 'from-orange-500 to-amber-400';
  const scoreBg = score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : 'bg-orange-500';
  const verdict = score === null ? 'Pending' : score >= 85 ? 'Low Risk' : score >= 70 ? 'Moderate' : 'High Risk';
  const verdictColor = score >= 85 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' : score >= 70 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-slate-700 dark:border-gray-700 shadow-xl h-full relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      {/* Header with Bot */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/bot.jpg" 
              alt="AI Assistant" 
              className={`w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/50 shadow-lg shadow-blue-500/20 ${analyzing ? 'animate-pulse' : ''}`}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${analyzing ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-500' : aiData ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
          </div>
          <div>
            <h4 className="font-black text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              AI Compliance Check
            </h4>
            <p className="text-xs text-slate-400 font-medium">Powered by Gemini AI</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${verdictColor}`}>
          {analyzing ? '⏳ Analyzing' : verdict}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {analyzing ? (
          <div className="py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-blue-400" size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm text-white font-bold">Analyzing Curriculum...</p>
                <p className="text-xs text-slate-400 mt-1">AI is reviewing alignment & risks</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-4">
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-red-300 font-medium leading-relaxed">{error}</p>
              </div>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-[1.02] active:scale-95"
              >
                <RefreshCw size={16} /> Retry AI Analysis
              </button>
            )}
          </div>
        ) : aiData ? (
          <>
            {/* AI Reason */}
            <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4">
              {aiData.reason}
            </p>

            {/* Score Bar */}
            {score !== null && (
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-slate-400">AI Confidence Score</span>
                  <span className={`text-lg font-black ${score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-blue-400' : 'text-orange-400'}`}>{score}%</span>
                </div>
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${scoreClass} rounded-full`}
                  />
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-3 border border-slate-700">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-emerald-400" /> Alignment
                </div>
                <p className="text-sm font-bold text-white mt-1">{aiData.alignment || 'Strong'}</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-3 border border-slate-700">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <TriangleAlert size={12} className="text-amber-400" /> Gaps
                </div>
                <p className="text-sm font-bold text-white mt-1">{aiData.gaps || 'Minor'}</p>
              </div>
            </div>

            {/* Detailed Analysis */}
            {(aiData.comparison?.strengths?.length || aiData.comparison?.risks?.length || aiData.comparison?.missingTopics?.length) && (
              <div className="space-y-3 text-xs">
                {aiData.comparison?.strengths?.length > 0 && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="font-bold text-emerald-400 uppercase flex items-center gap-2 mb-2">
                      <CheckCircle size={12} /> Strengths
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {aiData.comparison.strengths.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiData.comparison?.risks?.length > 0 && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <div className="font-bold text-orange-400 uppercase flex items-center gap-2 mb-2">
                      <TriangleAlert size={12} /> Risks
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {aiData.comparison.risks.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiData.comparison?.missingTopics?.length > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="font-bold text-red-400 uppercase flex items-center gap-2 mb-2">
                      <AlertCircle size={12} /> Missing Topics
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {aiData.comparison.missingTopics.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-slate-500" size={20} />
            </div>
            <p className="text-sm text-slate-400 font-medium">AI analysis unavailable</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all"
              >
                <RefreshCw size={14} /> Start Analysis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;
