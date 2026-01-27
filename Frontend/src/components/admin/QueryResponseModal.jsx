import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

const QueryResponseModal = ({ query, onClose, onRespond }) => {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('resolved');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRespond(response, status);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-gray-900">Respond to Student</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors font-bold">
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{query.subject}</h4>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{query.message}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">From: {query.studentId?.firstName} {query.studentId?.lastName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Response</label>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-white"
                                placeholder="Type your response here..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all font-medium text-gray-700 bg-white"
                            >
                                <option value="resolved">Resolved</option>
                                <option value="reviewed">Reviewed (Needs Follow-up)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 rounded-xl bg-accent-blue text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Send Response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QueryResponseModal;
