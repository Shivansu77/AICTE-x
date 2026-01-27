import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import CommunityHeader from '../components/community/CommunityHeader';
import ChatHeader from '../components/community/ChatHeader';
import MessageList from '../components/community/MessageList';
import MessageInput from '../components/community/MessageInput';

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

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col max-w-6xl mx-auto">
            {/* Header Section */}
            <CommunityHeader role={role} activeChannel={activeChannel} setActiveChannel={setActiveChannel} />

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col relative text-sm md:text-base">
                <ChatHeader activeChannel={activeChannel} />

                <MessageList
                    loading={loading}
                    messages={messages}
                    activeChannel={activeChannel}
                    currentUserId={currentUserId}
                    role={role}
                    messagesEndRef={messagesEndRef}
                    onDelete={async (msg) => {
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
                />

                <MessageInput
                    activeChannel={activeChannel}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default CommunityScreen;
