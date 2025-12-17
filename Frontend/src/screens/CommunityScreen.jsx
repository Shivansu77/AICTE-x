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
        try {
            const response = await api.get(`/api/messages?channel=${activeChannel}`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages', error);
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
            await api.post('/api/messages', {
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
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent-peach rounded-[2rem] flex items-center justify-center text-white shadow-lg">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-primary">Community</h1>
                        <p className="text-secondary font-medium">Faculty & Student Engagement Hub.</p>
                    </div>
                </div>

                {/* CHANNEL TOGGLE FOR FACULTY */}
                {(role === 'teacher' || role === 'faculty') && (
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-black/5 flex">
                        <button
                            onClick={() => setActiveChannel('academic')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeChannel === 'academic' ? 'bg-accent-blue text-white shadow-md' : 'text-secondary hover:bg-gray-50'
                                }`}
                        >
                            Academic
                        </button>
                        <button
                            onClick={() => setActiveChannel('governance')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeChannel === 'governance' ? 'bg-accent-yellow text-white shadow-md' : 'text-secondary hover:bg-gray-50'
                                }`}
                        >
                            Governance
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-secondary flex items-center gap-2">
                        <MessageCircle size={18} />
                        {activeChannel === 'governance' ? 'Governance Group (Admin & Faculty Only)' : 'Academic Group (Faculty & Students)'}
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        ● Online
                    </span>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="text-center text-secondary py-10">Loading conversation...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-secondary py-10 opacity-60">
                            No messages yet in {activeChannel} channel.
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
                            return (
                                <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getRoleBadgeColor(msg.role)}`}>
                                            {(msg.sender?.firstName?.[0] || 'U')}
                                        </div>
                                        <div>
                                            <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${isMe
                                                    ? 'bg-accent-blue text-white rounded-tr-none'
                                                    : 'bg-gray-100 text-primary rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <div className={`text-[10px] text-secondary mt-1 font-bold flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span>{msg.sender?.firstName} {msg.sender?.lastName}</span>
                                                <span className="opacity-60">• {msg.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-4">
                    <input
                        type="text"
                        placeholder={`Message #${activeChannel}...`}
                        className="flex-1 bg-gray-50 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-full py-3 px-6 font-medium text-primary outline-none transition-all"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-accent-peach text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    >
                        <Send size={20} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommunityScreen;
