import React, { useState } from 'react';
import { 
  Trophy, Medal, Award, TrendingUp, TrendingDown, 
  ChevronDown, ChevronUp, User, Calendar, Target,
  CheckCircle, AlertTriangle, XCircle, Sparkles, BarChart3,
  Crown, Zap, BookOpen, BrainCircuit
} from 'lucide-react';

/**
 * ProposalComparison Component
 * Shows ranked competing proposals with AI scores for admin decision-making
 */
const ProposalComparison = ({ 
  rankedProposals, 
  comparison, 
  onSelectProposal, 
  onApprove, 
  onReject,
  selectedId 
}) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!rankedProposals || rankedProposals.length === 0) {
    return null;
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={22} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-700 shadow-yellow-100 dark:shadow-yellow-900';
      case 2: return 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-700';
      case 3: return 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-700';
      default: return 'bg-white dark:bg-card border-gray-100 dark:border-border-color';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  const getRecommendationStyle = (rec) => {
    const styles = {
      'Highly Recommend': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700',
      'Recommend': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700',
      'Neutral': 'bg-gray-100 dark:bg-secondary/30 text-gray-700 dark:text-secondary border-gray-200 dark:border-border-color',
      'Needs Revision': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
      'Reject': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
    };
    return styles[rec] || styles['Neutral'];
  };

  const ScoreBar = ({ label, score, color }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-secondary">{label}</span>
        <span className={`font-bold ${score >= 70 ? 'text-green-600 dark:text-green-400' : score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}> 
          {score}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-secondary/30 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with AI Comparison Summary */}
      {comparison && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-100 dark:border-border-color">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-primary">AI Comparison Analysis</h3>
              <p className="text-xs text-secondary">{rankedProposals.length} proposals analyzed and ranked</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/60 dark:bg-card rounded-xl p-4">
              <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                <Sparkles size={16} /> Why #{1} is Recommended
              </h4>
              <p className="text-sm text-gray-700">{comparison.topChoiceReason}</p>
            </div>
            
            {comparison.keyDifferences && comparison.keyDifferences.length > 0 && (
              <div className="bg-white/60 dark:bg-card rounded-xl p-4">
                <h4 className="text-sm font-bold text-blue-700 mb-2">Key Differences</h4>
                <ul className="space-y-1">
                  {comparison.keyDifferences.map((diff, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                      {diff}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {comparison.concerns && comparison.concerns.length > 0 && (
              <div className="bg-white/60 dark:bg-card rounded-xl p-4">
                <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} /> Concerns
                </h4>
                <ul className="space-y-1">
                  {comparison.concerns.map((concern, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" />
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                💡 {comparison.adminGuidance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ranked Proposals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <BarChart3 size={20} className="text-accent-blue" />
          Ranked Proposals
        </h3>
        
        {rankedProposals.map((proposal) => {
          const aiScore = proposal.aiScore || {};
          const isExpanded = expandedId === proposal._id;
          const isSelected = selectedId === proposal._id;
          const rank = proposal.competingRank || 0;
          
          return (
            <div 
              key={proposal._id}
              className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${getRankBg(rank)} ${
                isSelected ? 'ring-2 ring-accent-blue dark:ring-accent-blue ring-offset-2' : ''
              } ${rank === 1 ? 'shadow-lg dark:shadow-indigo-900' : 'shadow-sm dark:shadow-secondary'}`}
            >
              {/* Main Card Header */}
              <div 
                className="p-5 cursor-pointer"
                onClick={() => onSelectProposal && onSelectProposal(proposal)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Rank & Faculty Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      {getRankIcon(rank)}
                      {rank === 1 && (
                        <span className="text-[10px] font-bold text-yellow-600 mt-1">BEST</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-400" />
                        <span className="font-bold text-primary">
                          {proposal.faculty?.firstName || proposal.facultyId?.firstName || 'Faculty'} {proposal.faculty?.lastName || proposal.facultyId?.lastName || ''}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          proposal.requestType === 'Bulk Update' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                          'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        }`}>
                          {proposal.requestType}
                        </span>
                      </div>
                      
                      <p className="text-sm text-secondary line-clamp-2 mb-2">{proposal.justification}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                        {proposal.proposedChanges?.units && (
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {proposal.proposedChanges.units.length} units
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Display */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-2 rounded-xl font-black text-2xl ${getScoreColor(aiScore.overallScore || 0)}`}>
                      {aiScore.overallScore || 0}%
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecommendationStyle(aiScore.aiRecommendation)}`}>
                      {aiScore.aiRecommendation || 'Analyzing...'}
                    </span>
                  </div>
                </div>
                
                {/* Quick Score Bars */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{aiScore.industryRelevance || 0}%</div>
                    <div className="text-[10px] text-gray-500 dark:text-secondary uppercase font-medium">Industry Relevance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{aiScore.contentQuality || 0}%</div>
                    <div className="text-[10px] text-gray-500 dark:text-secondary uppercase font-medium">Content Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{aiScore.modernCoverage || 0}%</div>
                    <div className="text-[10px] text-gray-500 dark:text-secondary uppercase font-medium">Modern Coverage</div>
                  </div>
                </div>
              </div>
              
              {/* Expand Toggle */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : proposal._id)}
                className="w-full py-2 bg-gray-50/50 dark:bg-secondary/30 hover:bg-gray-100/50 dark:hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-secondary"
              >
                {isExpanded ? (
                  <>Hide Details <ChevronUp size={16} /></>
                ) : (
                  <>View Full Analysis <ChevronDown size={16} /></>
                )}
              </button>
              
              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-5 bg-white/80 dark:bg-card border-t border-gray-100 dark:border-border-color space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Detailed Scores */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-primary mb-3">Score Breakdown</h4>
                      <ScoreBar label="Content Quality" score={aiScore.contentQuality || 0} color="bg-blue-500" />
                      <ScoreBar label="Industry Relevance" score={aiScore.industryRelevance || 0} color="bg-green-500" />
                      <ScoreBar label="Structural Consistency" score={aiScore.structuralConsistency || 0} color="bg-purple-500" />
                      <ScoreBar label="Pedagogical Flow" score={aiScore.pedagogicalFlow || 0} color="bg-orange-500" />
                      <ScoreBar label="Modern Coverage" score={aiScore.modernCoverage || 0} color="bg-teal-500" />
                      <ScoreBar label="Market Alignment" score={aiScore.marketAlignment || 0} color="bg-pink-500" />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-primary mb-3">Predicted Outcomes</h4>
                      <div className="space-y-3">
                        <div className="bg-green-50 rounded-xl p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-green-700 dark:text-green-400 font-medium">Employability</span>
                            <span className="text-lg font-bold text-green-700 dark:text-green-400">{aiScore.predictedEmployability || 0}%</span>
                          </div>
                          <div className="h-2 bg-green-100 dark:bg-green-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: `${aiScore.predictedEmployability || 0}%` }} />
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-xl p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">Skill Gap Reduction</span>
                            <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{aiScore.skillGapReduction || 0}%</span>
                          </div>
                          <div className="h-2 bg-blue-100 dark:bg-blue-900/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: `${aiScore.skillGapReduction || 0}%` }} />
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">Confidence:</span>{' '}
                          <span className={`font-bold ${
                            aiScore.confidence === 'High' ? 'text-green-600 dark:text-green-400' :
                            aiScore.confidence === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>{aiScore.confidence || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Explanation */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500" /> AI Analysis
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-secondary">{aiScore.aiExplanation || 'No explanation available'}</p>
                  </div>
                  
                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-4">
                    {aiScore.strengths && aiScore.strengths.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                          <CheckCircle size={14} /> Strengths
                        </h4>
                        <ul className="space-y-1">
                          {aiScore.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-secondary flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-400 dark:bg-green-700 mt-1.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiScore.weaknesses && aiScore.weaknesses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                          <XCircle size={14} /> Weaknesses
                        </h4>
                        <ul className="space-y-1">
                          {aiScore.weaknesses.map((w, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-secondary flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-400 dark:bg-red-700 mt-1.5" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Missing Topics */}
                  {aiScore.missingTopics && aiScore.missingTopics.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                        <AlertTriangle size={14} /> Missing Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiScore.missingTopics.map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-medium">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onApprove && onApprove(proposal._id)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve This Proposal
                    </button>
                    <button
                      onClick={() => onReject && onReject(proposal._id)}
                      className="px-6 py-3 bg-gray-100 dark:bg-secondary/30 text-gray-600 dark:text-secondary font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-secondary/50 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProposalComparison;
