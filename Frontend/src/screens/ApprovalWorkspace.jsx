import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import api from '../utils/api';
import ReviewHeader from '../components/approval/ReviewHeader';
import AIInsightCard from '../components/approval/AIInsightCard';
import DiffPanel from '../components/approval/DiffPanel';

const ApprovalWorkspace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [baselineCurriculum, setBaselineCurriculum] = useState(null);

  const [aiData, setAiData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/requests/${id}`);
        setRequest(response.data || null);
      } catch (error) {
        console.error('Failed to fetch request', error);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const runAnalysis = async () => {
    if (!request || !baselineCurriculum) return;

    setAnalyzing(true);
    setAiData(null);
    setAiError('');

    try {
      const response = await api.post('/ai/analyze-syllabus', {
        justification: request.justification,
        proposedChanges: request.proposedChanges,
        baselineCurriculum,
      });
      setAiData(response.data);
    } catch (error) {
      console.error('AI Analysis failed', error);
      setAiData(null);
      setAiError(error.response?.data?.error || error.message || 'AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [request, baselineCurriculum]);

  useEffect(() => {
    const fetchBaseline = async () => {
      if (!request?.curriculumId) return;
      try {
        const curriculumId = request.curriculumId._id || request.curriculumId;
        const response = await api.get(`/curriculum/${curriculumId}`);
        setBaselineCurriculum(response.data);
      } catch (error) {
        console.error('Failed to fetch baseline curriculum', error);
        setBaselineCurriculum(null);
      }
    };

    fetchBaseline();
  }, [request]);

  const handleAction = async (status) => {
    if (!request?._id) return;
    try {
      await api.put(`/requests/${request._id}/status`, { status });
      navigate('/admin/approvals');
    } catch (error) {
      console.error(error);
      alert('Action failed. Please try again.');
    }
  };

  const title = useMemo(
    () => request?.curriculumId?.title || request?.courseId?.title || 'Curriculum Update',
    [request]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-secondary animate-pulse">Loading AI workspace...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
        <button
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to approvals
        </button>
        <div className="mt-8 flex flex-col items-center justify-center text-gray-400">
          <Check size={48} />
          <p className="mt-3 text-sm font-bold">Request not found or already processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
      <div className="px-6 lg:px-10 pt-6">
        <button
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to approvals
        </button>
      </div>

      <div className="mt-6 bg-white/80 backdrop-blur-md rounded-t-[2.5rem] border-t border-white/70 shadow-2xl shadow-blue-900/5">
        <ReviewHeader
          request={request}
          onReject={() => handleAction('rejected')}
          onApprove={() => handleAction('approved')}
        />

        <div className="px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wider text-gray-500">Request Summary</div>
              <div className="mt-2 text-lg font-black text-gray-900">{request.requestType || 'Update'}</div>
              <div className="mt-2 text-sm text-gray-600 line-clamp-3">
                {request.justification || 'No justification provided.'}
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Industry Reference: {request.industryReference || 'Standard Update'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wider text-gray-500">Baseline Curriculum</div>
              <div className="mt-2 text-lg font-black text-gray-900">{baselineCurriculum?.title || title}</div>
              <div className="mt-2 text-sm text-gray-600">
                Units: {baselineCurriculum?.units?.length ?? 0}
              </div>
              <div className="mt-4 text-xs text-gray-400">Baseline vs proposed comparison.</div>
            </div>

            <AIInsightCard analyzing={analyzing} aiData={aiData} error={aiError} onRetry={runAnalysis} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DiffPanel selectedReq={request} baseline={baselineCurriculum} aiSyllabus={aiData?.aiSyllabus} />
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkspace;
