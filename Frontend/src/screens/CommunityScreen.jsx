import React, { useEffect, useState, useRef } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';
import api from '../utils/api';

const CommunityScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student';
    const currentUserId = user._id || user.id; // handle both possibilities depending on how auth saves it

    // Determine allowed channels
    // Admin: Governance Only
    // Student: Academic Only
    // Faculty: Both
    const [activeChannel, setActiveChannel] = useState(role === 'admin' ? 'governance' : 'academic');

    const fetchMessages = async () => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get(`/messages?channel=${activeChannel}`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds for simple real-time effect
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [activeChannel]); // Re-fetch when channel changes

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post('/messages', {
                content: newMessage,
                role: user.role || 'Student',
                senderId: currentUserId,
                channel: activeChannel
            });
            setNewMessage('');
            fetchMessages(); // Refresh immediately
        } catch (error) {
            console.error('Failed to send message', error);
            alert('Failed to send message');
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-accent-yellow text-white';
            case 'teacher':
            case 'faculty': return 'bg-accent-blue text-white';
            default: return 'bg-accent-green text-white'; // Student
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 shrink-0 gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-peach to-orange-400 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-accent-peach/20 hover:scale-105 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-primary tracking-tight">Community</h1>
                        <p className="text-secondary font-medium text-lg">Faculty & Student Engagement Hub.</p>
                    </div>
                </div>

                {/* CHANNEL TOGGLE */}
                {(role === 'teacher' || role === 'faculty') && (
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex relative">
                        {/* Animated slider could be added here, simplified for now */}
                        <button
                            onClick={() => setActiveChannel('academic')}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeChannel === 'academic'
                                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 translate-y-[-2px]'
                                : 'text-secondary hover:bg-gray-50'
                                }`}
                        >
                            Academic
                        </button>
                        <button
                            onClick={() => setActiveChannel('governance')}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeChannel === 'governance'
                                ? 'bg-accent-yellow text-white shadow-lg shadow-accent-yellow/30 translate-y-[-2px]'
                                : 'text-secondary hover:bg-gray-50'
                                }`}
                        >
                            Governance
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col relative text-sm md:text-base">
                {/* Chat Header */}
                <div className="bg-white/80 backdrop-blur-md p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl text-white ${activeChannel === 'governance' ? 'bg-accent-yellow' : 'bg-accent-blue'}`}>
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-primary text-lg">
                                {activeChannel === 'governance' ? 'Governance Group' : 'Academic Group'}
                            </h3>
                            <p className="text-xs font-bold text-secondary opacity-60 uppercase tracking-wider">
                                {activeChannel === 'governance' ? 'Admin & Faculty Only' : 'Faculty & Students'}
                            </p>
                        </div>
                    </div>
                    <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Live
                    </span>
                </div>

                {/* Messages List - with custom scrollbar styling usually applied via CSS, assuming 'custom-scrollbar' class exists or default */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse flex flex-col items-center gap-3 opacity-50">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <MessageCircle size={40} />
                            </div>
                            <p className="text-secondary font-bold text-lg">No messages yet.</p>
                            <p className="text-secondary/60 text-sm">Be the first to start the conversation in #{activeChannel}!</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
                            const showAvatar = idx === 0 || messages[idx - 1].sender?._id !== msg.sender?._id;

                            // Dynamic Role Colors
                            const roleColor = msg.role === 'Admin' ? 'text-accent-yellow' : (msg.role === 'Faculty' || msg.role === 'Teacher' ? 'text-accent-blue' : 'text-emerald-500');

                            return (
                                <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} group`}>

                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center text-sm font-black shrink-0 shadow-sm transition-transform hover:scale-110 cursor-default ${showAvatar ? getRoleBadgeColor(msg.role) : 'opacity-0'}`}>
                                            {msg.sender?.firstName?.[0] || 'U'}
                                        </div>

                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {/* Role Label (only if changed sender) */}
                                            {showAvatar && !isMe && (
                                                <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ml-1 ${roleColor}`}>
                                                    {msg.sender?.firstName} {msg.sender?.lastName} <span className="opacity-50">• {msg.role}</span>
                                                </span>
                                            )}

                                            {/* Bubble */}
                                            <div className={`px-6 py-4 rounded-[1.5rem] text-sm md:text-base font-medium shadow-sm relative transition-all duration-200 hover:shadow-md leading-relaxed ${isMe
                                                ? 'bg-gradient-to-br from-accent-blue to-cyan-500 text-white rounded-tr-sm'
                                                : 'bg-white text-primary border border-gray-100 rounded-tl-sm'
                                                }`}>
                                                {msg.content}

                                                {/* Delete Button (Admin) */}
                                                {role === 'admin' && (
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Delete this message?')) {
                                                                try {
                                                                    await api.delete(`/messages/${msg._id}`);
                                                                    setMessages(prev => prev.filter(m => m._id !== msg._id));
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert('Failed to delete message');
                                                                }
                                                            }
                                                        }}
                                                        className={`absolute -top-3 ${isMe ? '-left-3' : '-right-3'} opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg transition-all scale-75 hover:scale-100 z-10`}
                                                        title="Delete Message"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <span className="text-[10px] font-bold text-gray-300 mt-1 px-2">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-gray-50 p-2 pr-3 rounded-[2rem] border border-gray-200 focus-within:border-accent-peach focus-within:ring-4 focus-within:ring-accent-peach/10 transition-all shadow-inner">
                        <input
                            type="text"
                            placeholder={`Message #${activeChannel}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-6 font-medium text-primary placeholder-gray-400"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 bg-accent-peach text-white rounded-full flex items-center justify-center shadow-lg shadow-accent-peach/30 hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer active:scale-95 shrink-0"
                        >
                            <Send size={20} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommunityScreen;
