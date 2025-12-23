import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Brain, ChevronRight, BarChart2, BookOpen, Search, Loader } from 'lucide-react';
import api from '../utils/api';

const AiApproval = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/api/requests/pending');
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch requests", error);
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate AI Analysis delay
    setTimeout(() => {
      // Mock AI Response based on request content
      // In a real app, this would call a backend endpoint that uses Gemini API
      const mockAnalysis = {
        relevanceScore: Math.floor(Math.random() * (98 - 75) + 75),
        consensusScore: Math.floor(Math.random() * (95 - 70) + 70),
        correctnessPercentage: Math.floor(Math.random() * (99 - 80) + 80),
        missingTopics: ['Cloud Native Patterns', 'Ethical AI', 'Green Computing'],
        explanation: "The proposed topic aligns well with current industry trends. However, it lacks coverage on sustainability aspects which are becoming crucial. The technical depth is sufficient for the target semester.",
        suggestions: [
          "Include a module on 'Sustainable Tech'",
          "Add practical labs for this topic"
        ]
      };
      setAnalysisResult(mockAnalysis);
      setAnalyzing(false);
    }, 2000);
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/requests/${id}/status`, { status: 'approved' });
      setRequests(requests.filter(r => r._id !== id));
      setSelectedRequest(null);
      setAnalysisResult(null);
      alert("Request Approved!");
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/requests/${id}/status`, { status: 'rejected' });
      setRequests(requests.filter(r => r._id !== id));
      setSelectedRequest(null);
      setAnalysisResult(null);
      alert("Request Rejected!");
    } catch (error) {
      console.error("Failed to reject", error);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-primary">AI Syllabus Approval Engine</h1>
            <p className="text-secondary font-medium">Powered by Gemini • Automated Validation & Scoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-accent-blue" />
              Pending Proposals
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-secondary">Loading...</div>
            ) : requests.length === 0 ? (
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
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                      {req.requestType}
                    </span>
                    <span className="text-xs text-secondary font-medium">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-primary mb-1 line-clamp-1">
                    {req.proposedChanges?.newTopic || req.proposedChanges?.unitTitle || req.requestType}
                  </h3>
                  <p className="text-xs text-secondary line-clamp-2">{req.justification}</p>
                </div>
              ))
            )}
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 min-h-[600px] relative overflow-hidden">
                {/* Header */}
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
                      title="Reject"
                    >
                      <XCircle size={24} />
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedRequest._id)}
                      className="p-3 rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Justification</h4>
                  <p className="text-primary leading-relaxed">{selectedRequest.justification}</p>
                  
                  {selectedRequest.proposedChanges?.description && (
                    <>
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-2 mt-4">Proposed Changes</h4>
                      <p className="text-primary leading-relaxed">{selectedRequest.proposedChanges.description}</p>
                    </>
                  )}
                </div>

                {/* AI Analysis Section */}
                {!analysisResult ? (
                  <div className="text-center py-12">
                    {analyzing ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                          <Loader className="animate-spin text-purple-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Gemini is analyzing...</h3>
                        <p className="text-secondary">Validating topics, checking relevance, and calculating scores.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Brain className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">AI Validation Required</h3>
                        <p className="text-secondary mb-6 max-w-md">
                          Run the AI engine to validate this proposal against global curriculum standards and industry trends.
                        </p>
                        <button 
                          onClick={handleAnalyze}
                          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <Brain size={20} /> Analyze with Gemini
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                      <Brain className="text-purple-600" size={24} />
                      <h3 className="text-xl font-bold text-primary">Analysis Results</h3>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 text-center">
                        <div className="text-3xl font-black text-purple-600 mb-1">{analysisResult.relevanceScore}%</div>
                        <div className="text-xs font-bold text-purple-400 uppercase">Relevance</div>
                      </div>
                      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center">
                        <div className="text-3xl font-black text-blue-600 mb-1">{analysisResult.consensusScore}%</div>
                        <div className="text-xs font-bold text-blue-400 uppercase">Consensus</div>
                      </div>
                      <div className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center">
                        <div className="text-3xl font-black text-green-600 mb-1">{analysisResult.correctnessPercentage}%</div>
                        <div className="text-xs font-bold text-green-400 uppercase">Correctness</div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                          <Search size={16} className="text-secondary" /> AI Explanation
                        </h4>
                        <p className="text-secondary leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                          {analysisResult.explanation}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} /> Missing Modern Topics
                          </h4>
                          <ul className="space-y-2">
                            {analysisResult.missingTopics.map((topic, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-secondary bg-red-50/50 p-2 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-indigo-600 mb-3 flex items-center gap-2">
                            <CheckCircle size={16} /> Suggestions
                          </h4>
                          <ul className="space-y-2">
                            {analysisResult.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-secondary bg-indigo-50/50 p-2 rounded-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
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
                <p className="text-gray-400 max-w-xs">Choose a pending request from the list to view details and run AI validation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiApproval;
