import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, Brain, ChevronRight, BarChart2, BookOpen, 
  Search, Loader, Clock, Users, Trophy, Sparkles, RefreshCw, Eye, Filter,
  TrendingUp, Zap, Target, BrainCircuit, Crown, Medal
} from 'lucide-react';
import api from '../utils/api';
import ProposalComparison from '../components/approval/ProposalComparison';

const AiApproval = () => {
  const [requests, setRequests] = useState([]);
  const [groupedData, setGroupedData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'single'
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);

  useEffect(() => {
    fetchPendingGrouped();
  }, []);

  // Fetch proposals grouped by curriculum - main view for comparison
  const fetchPendingGrouped = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/ai/pending-grouped');
      setGroupedData(data);
      
      // Also fetch flat list for single view
      const { data: flatData } = await api.get('/requests/pending');
      setRequests(flatData);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch grouped requests", error);
      // Fallback to regular fetch
      try {
        const { data } = await api.get('/requests/pending');
        setRequests(data);
      } catch (err) {
        console.error("Fallback fetch failed", err);
      }
      setLoading(false);
    }
  };

  // Analyze all competing proposals for a curriculum
  const handleAnalyzeCompeting = async (curriculumId) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const { data } = await api.post(`/ai/analyze-competing/${curriculumId}`);
      setAnalysisResult(data);
      
      // Refresh grouped data to show updated scores
      await fetchPendingGrouped();
    } catch (error) {
      console.error("Failed to analyze competing proposals", error);
      alert("AI Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Batch score all unscored proposals
  const handleBatchScore = async () => {
    setBatchAnalyzing(true);
    try {
      const { data } = await api.post('/ai/batch-score');
      alert(`Batch scoring complete!\nScored: ${data.scored}\nFailed: ${data.failed}`);
      await fetchPendingGrouped();
    } catch (error) {
      console.error("Batch scoring failed", error);
      alert("Batch scoring failed. Please try again.");
    } finally {
      setBatchAnalyzing(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/${id}/status`, { status: 'approved' });
      setRequests(requests.filter(r => r._id !== id));
      setSelectedRequest(null);
      setSelectedGroup(null);
      setAnalysisResult(null);
      await fetchPendingGrouped();
      alert("Request Approved!");
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/requests/${id}/status`, { status: 'rejected' });
      setRequests(requests.filter(r => r._id !== id));
      setSelectedRequest(null);
      setSelectedGroup(null);
      setAnalysisResult(null);
      await fetchPendingGrouped();
      alert("Request Rejected!");
    } catch (error) {
      console.error("Failed to reject", error);
    }
  };

  // Stats calculation
  const stats = {
    totalPending: groupedData?.totalPending || requests.length,
    competingGroups: groupedData?.competingCount || 0,
    analyzedCount: requests.filter(r => r.aiScore?.overallScore).length,
    needsAnalysis: requests.filter(r => !r.aiScore?.overallScore).length
  };

  return (
    <div className="flex-1 min-h-screen bg-cream p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
              <BrainCircuit className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-primary">AI Syllabus Approval Engine</h1>
              <p className="text-secondary font-medium">
                Powered by Gemini AI • Compare & Rank Competing Proposals
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'grouped' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={16} className="inline mr-2" />
                Competing View
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'single' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={16} className="inline mr-2" />
                Single View
              </button>
            </div>
            
            {/* Batch Analyze Button */}
            <button
              onClick={handleBatchScore}
              disabled={batchAnalyzing}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {batchAnalyzing ? (
                <><Loader className="animate-spin" size={18} /> Analyzing...</>
              ) : (
                <><Zap size={18} /> Auto-Score All</>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <BookOpen className="text-blue-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-primary">{stats.totalPending}</div>
                <div className="text-xs text-secondary font-medium">Total Pending</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users className="text-orange-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-primary">{stats.competingGroups}</div>
                <div className="text-xs text-secondary font-medium">Competing Groups</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-primary">{stats.analyzedCount}</div>
                <div className="text-xs text-secondary font-medium">AI Analyzed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Brain className="text-purple-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-primary">{stats.needsAnalysis}</div>
                <div className="text-xs text-secondary font-medium">Needs Analysis</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-purple-500" size={40} />
            <span className="ml-4 text-secondary font-medium">Loading proposals...</span>
          </div>
        ) : viewMode === 'grouped' ? (
          /* GROUPED VIEW - For Comparing Competing Proposals */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Curriculum Groups List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Target size={20} className="text-accent-blue" />
                Curriculum Groups
              </h2>
              
              {!groupedData?.curriculumGroups || groupedData.curriculumGroups.length === 0 ? (
                <div className="bg-white p-8 rounded-[2rem] text-center border border-gray-100 shadow-sm">
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                  <p className="text-primary font-bold">All Caught Up!</p>
                  <p className="text-secondary text-sm">No pending requests.</p>
                </div>
              ) : (
                groupedData.curriculumGroups.map((group) => {
                  const isSelected = selectedGroup?.curriculum?._id === group.curriculum?._id;
                  const topProposal = group.proposals[0];
                  const hasScore = topProposal?.aiScore?.overallScore;
                  
                  return (
                    <div
                      key={group.curriculum?._id || 'unknown'}
                      onClick={() => {
                        setSelectedGroup(group);
                        setAnalysisResult(null);
                      }}
                      className={`p-5 rounded-[1.5rem] cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-white border-accent-blue shadow-md scale-[1.02]'
                          : 'bg-white border-gray-100 hover:border-accent-blue/30 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-primary mb-1 line-clamp-1">
                            {group.curriculum?.title || 'Unknown Curriculum'}
                          </h3>
                          <p className="text-xs text-secondary mb-2">
                            {group.course?.title || 'Course'} • {group.course?.code || ''}
                          </p>
                        </div>
                        
                        {group.hasCompeting && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <Trophy size={10} />
                            {group.proposals.length} competing
                          </span>
                        )}
                      </div>
                      
                      {/* Mini Proposal Preview */}
                      <div className="space-y-2">
                        {group.proposals.slice(0, 2).map((proposal, idx) => (
                          <div key={proposal._id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              {idx === 0 ? (
                                <Crown size={12} className="text-yellow-500" />
                              ) : (
                                <Medal size={12} className="text-gray-400" />
                              )}
                              <span className="text-gray-600">
                                {proposal.facultyId?.firstName || 'Faculty'}
                              </span>
                            </div>
                            {proposal.aiScore?.overallScore ? (
                              <span className={`font-bold ${
                                proposal.aiScore.overallScore >= 80 ? 'text-green-600' :
                                proposal.aiScore.overallScore >= 60 ? 'text-blue-600' :
                                'text-orange-600'
                              }`}>
                                {proposal.aiScore.overallScore}%
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">Unscored</span>
                            )}
                          </div>
                        ))}
                        {group.proposals.length > 2 && (
                          <p className="text-[10px] text-gray-400 text-center">
                            +{group.proposals.length - 2} more proposals
                          </p>
                        )}
                      </div>
                      
                      {!hasScore && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                            <Sparkles size={12} />
                            Click to run AI comparison
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Comparison Panel */}
            <div className="lg:col-span-2">
              {selectedGroup ? (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[600px]">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-primary mb-1">
                        {selectedGroup.curriculum?.title || 'Curriculum Comparison'}
                      </h2>
                      <p className="text-secondary font-medium">
                        {selectedGroup.proposals.length} proposals from different faculty members
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleAnalyzeCompeting(selectedGroup.curriculum?._id)}
                      disabled={analyzing}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {analyzing ? (
                        <><Loader className="animate-spin" size={18} /> Analyzing...</>
                      ) : (
                        <><BrainCircuit size={18} /> Compare with AI</>
                      )}
                    </button>
                  </div>
                  
                  {/* Analysis Results */}
                  {analysisResult ? (
                    <ProposalComparison
                      rankedProposals={analysisResult.rankedProposals}
                      comparison={analysisResult.comparison}
                      onSelectProposal={(p) => setSelectedRequest(p)}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      selectedId={selectedRequest?._id}
                    />
                  ) : (
                    <div className="text-center py-16">
                      {analyzing ? (
                        <div className="flex flex-col items-center animate-pulse">
                          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                            <Loader className="animate-spin text-purple-600" size={40} />
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-2">Analyzing with Gemini AI...</h3>
                          <p className="text-secondary max-w-md">
                            Comparing all {selectedGroup.proposals.length} proposals, scoring each dimension, 
                            and ranking by overall quality.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                            <Trophy className="text-purple-400" size={40} />
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-2">
                            {selectedGroup.proposals.length} Competing Proposals
                          </h3>
                          <p className="text-secondary mb-8 max-w-md">
                            Click "Compare with AI" to analyze all proposals, score them on multiple dimensions, 
                            and see which one has the highest accuracy for this syllabus change.
                          </p>
                          
                          {/* Quick Preview of Proposals */}
                          <div className="w-full max-w-lg space-y-3">
                            {selectedGroup.proposals.map((proposal, idx) => (
                              <div key={proposal._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm text-gray-600">
                                    {idx + 1}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-primary">
                                      {proposal.facultyId?.firstName} {proposal.facultyId?.lastName}
                                    </p>
                                    <p className="text-xs text-secondary">{proposal.requestType}</p>
                                  </div>
                                </div>
                                {proposal.aiScore?.overallScore ? (
                                  <div className={`px-3 py-1 rounded-full font-bold ${
                                    proposal.aiScore.overallScore >= 80 ? 'bg-green-100 text-green-700' :
                                    proposal.aiScore.overallScore >= 60 ? 'bg-blue-100 text-blue-700' :
                                    'bg-orange-100 text-orange-700'
                                  }`}>
                                    {proposal.aiScore.overallScore}%
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Not scored</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Trophy className="text-gray-300" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Curriculum Group</h3>
                  <p className="text-gray-400 max-w-xs">
                    Choose a curriculum from the list to compare competing proposals and let AI rank them by accuracy.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SINGLE VIEW - Original individual proposal view */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Request List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-accent-blue" />
                All Pending Proposals
              </h2>

              {requests.length === 0 ? (
                <div className="bg-white p-8 rounded-[2rem] text-center border border-gray-100 shadow-sm">
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                  <p className="text-primary font-bold">All Caught Up!</p>
                  <p className="text-secondary text-sm">No pending requests.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div
                    key={req._id}
                    onClick={() => { setSelectedRequest(req); setAnalysisResult(null); }}
                    className={`p-5 rounded-[1.5rem] cursor-pointer transition-all border ${
                      selectedRequest?._id === req._id
                        ? 'bg-white border-accent-blue shadow-md scale-[1.02]'
                        : 'bg-white border-gray-100 hover:border-accent-blue/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          req.requestType === 'Bulk Update' ? 'bg-blue-50 text-blue-600' :
                          req.requestType === 'Add Unit' ? 'bg-green-50 text-green-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {req.requestType}
                        </span>
                        {req.aiScore?.overallScore && (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            req.aiScore.overallScore >= 80 ? 'bg-green-100 text-green-700' :
                            req.aiScore.overallScore >= 60 ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            AI: {req.aiScore.overallScore}%
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-secondary font-medium">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-primary mb-1 line-clamp-1">
                      {req.proposedChanges?.newTopic || req.proposedChanges?.unitTitle || req.requestType}
                    </h3>
                    <p className="text-xs text-secondary line-clamp-2 mb-2">{req.justification}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary">
                        By: <span className="font-medium text-primary">{req.facultyId?.firstName || 'Faculty'}</span>
                      </span>
                      {req.competingRank && req.totalCompeting > 1 && (
                        <span className="text-orange-600 font-medium">
                          Rank #{req.competingRank} of {req.totalCompeting}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Single Proposal Detail Panel */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[600px]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-primary mb-2">
                        {selectedRequest.proposedChanges?.newTopic || selectedRequest.proposedChanges?.unitTitle || selectedRequest.requestType}
                      </h2>
                      <p className="text-secondary font-medium">
                        Submitted by <span className="text-primary font-bold">{selectedRequest.facultyId?.firstName || 'Faculty'}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(selectedRequest._id)}
                        className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                      <button
                        onClick={() => handleApprove(selectedRequest._id)}
                        className="p-3 rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={24} />
                      </button>
                    </div>
                  </div>

                  {/* AI Score Display */}
                  {selectedRequest.aiScore?.overallScore && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-primary flex items-center gap-2">
                          <Brain className="text-purple-500" size={20} />
                          AI Analysis Score
                        </h3>
                        <div className={`px-4 py-2 rounded-xl font-black text-2xl ${
                          selectedRequest.aiScore.overallScore >= 80 ? 'bg-green-100 text-green-700' :
                          selectedRequest.aiScore.overallScore >= 60 ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {selectedRequest.aiScore.overallScore}%
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{selectedRequest.aiScore.industryRelevance || 0}%</div>
                          <div className="text-xs text-gray-500">Industry Relevance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{selectedRequest.aiScore.contentQuality || 0}%</div>
                          <div className="text-xs text-gray-500">Content Quality</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{selectedRequest.aiScore.modernCoverage || 0}%</div>
                          <div className="text-xs text-gray-500">Modern Coverage</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700">{selectedRequest.aiScore.aiExplanation}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          selectedRequest.aiScore.aiRecommendation === 'Highly Recommend' || selectedRequest.aiScore.aiRecommendation === 'Recommend' 
                            ? 'bg-green-100 text-green-700' 
                            : selectedRequest.aiScore.aiRecommendation === 'Needs Revision'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedRequest.aiScore.aiRecommendation}
                        </span>
                        <span className="text-xs text-gray-500">
                          Confidence: <span className="font-bold">{selectedRequest.aiScore.confidence}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Justification */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Justification</h4>
                    <p className="text-primary leading-relaxed">{selectedRequest.justification}</p>
                  </div>

                  {/* Proposed Changes */}
                  {selectedRequest.proposedChanges?.units && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <BookOpen size={16} /> Proposed Syllabus ({selectedRequest.proposedChanges.units.length} units)
                      </h4>
                      <div className="max-h-[300px] overflow-y-auto space-y-3">
                        {selectedRequest.proposedChanges.units.map((unit, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-primary">Unit {unit.unitNumber || idx + 1}: {unit.title}</span>
                              <span className="text-xs text-secondary">{unit.hours} hrs</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {unit.topics?.map((t, i) => (
                                <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <BarChart2 className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Proposal</h3>
                  <p className="text-gray-400 max-w-xs">Choose a pending request from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiApproval;
