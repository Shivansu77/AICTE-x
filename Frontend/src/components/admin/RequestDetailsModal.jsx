import React from 'react';
import { XCircle } from 'lucide-react';

const RequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    if (!request) return null;
    const { proposedChanges } = request;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-gray-900">Review Request</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Type</label>
                            <p className="font-bold text-gray-900">{request.requestType}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-1">Submitted By</label>
                            <p className="text-gray-900 font-medium">{request.facultyId?.firstName} {request.facultyId?.lastName}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Justification</label>
                        <p className="text-gray-700 p-4 bg-gray-50 rounded-2xl text-sm leading-relaxed border border-gray-100">{request.justification}</p>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                        <label className="text-accent-blue text-xs font-bold uppercase mb-3 block tracking-wider">Proposed Changes</label>
                        {(request.requestType === 'Add Unit' || request.requestType === 'Update Unit') ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Unit Number</span>
                                    <b className="text-gray-900">{proposedChanges.unitNumber}</b>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Hours</span>
                                    <b className="text-gray-900">{proposedChanges.unitHours} Hrs</b>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium block mb-1">Unit Title</span>
                                    <b className="text-gray-900 text-base">{proposedChanges.unitTitle}</b>
                                </div>
                            </div>
                        ) : request.requestType.includes('Topic') ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-600 font-medium">Target Unit</span>
                                    <b className="text-gray-900">Unit {proposedChanges.unitNumber}</b>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium block mb-1">Topic Name</span>
                                    <b className="text-gray-900 text-base">{proposedChanges.newTopic}</b>
                                </div>
                                {proposedChanges.description && (
                                    <div className="mt-3 pt-3 border-t border-blue-100">
                                        <span className="text-gray-600 font-medium block mb-1">
                                            {request.requestType.includes('Remove') ? 'Detail to Remove' : 'New Detail Content'}
                                        </span>
                                        <p className="text-gray-900 text-sm italic bg-white/50 p-3 rounded-lg border border-blue-100">
                                            "{proposedChanges.description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm">
                                <label className="text-gray-600 text-xs font-bold block mb-1">Description Update:</label>
                                <p className="font-medium text-gray-900 italic">"{proposedChanges.description}"</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => { onReject(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => { onApprove(); onClose(); }}
                            className="flex-1 py-3 px-6 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;
