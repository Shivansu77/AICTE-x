import React, { useEffect, useState } from 'react';
import announcementImg from '../assets/announcement.png';
import { Megaphone, Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';
import api from '../utils/api';

const AnnouncementsScreen = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await api.get('/announcement');
                setAnnouncements(response.data);
            } catch (error) {
                console.error('Failed to fetch announcements', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const getTypeStyles = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-100 text-red-600 border-red-200';
            case 'success': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert': return AlertCircle;
            case 'success': return CheckCircle;
            default: return Info;
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'student';
    const [announcement, setAnnouncement] = useState({ title: '', content: '', type: 'info' });
    const [posting, setPosting] = useState(false);

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        setPosting(true);
        try {
            await api.post('/announcement', announcement);
            alert('Announcement Posted Successfully!');
            setAnnouncement({ title: '', content: '', type: 'info' });
            // Refresh list
            const response = await api.get('/announcement');
            setAnnouncements(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to post announcement');
        } finally {
            setPosting(false);
        }
    };

    if (loading) return <div className="p-8 font-bold text-secondary text-center">Loading Updates...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg overflow-hidden border border-black/5 bg-white">
                    <img src={announcementImg} alt="Announcements" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-primary">Announcements</h1>
                    <p className="text-secondary font-medium">Implementation updates, events, and notices.</p>
                </div>
            </div>
            {/* Admin Only: Post Announcement Form */}
            {role === 'admin' && (
                <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-primary mb-4">Post New Announcement</h3>
                    <form onSubmit={handlePostAnnouncement} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Announcement Title (e.g. Hackathon 2025)"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-xl py-3 px-4 font-bold text-primary outline-none transition-all"
                                value={announcement.title}
                                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                                required
                            />
                            <div className="flex gap-4">
                                <select
                                    className="bg-gray-50 border-2 border-transparent focus:border-accent-peach rounded-xl py-3 px-4 font-bold text-secondary outline-none cursor-pointer flex-1"
                                    value={announcement.type}
                                    onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value })}
                                >
                                    <option value="info">Info</option>
                                    <option value="alert">Alert</option>
                                    <option value="success">Success</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={posting}
                                    className="flex-1 bg-accent-peach text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                                >
                                    {posting ? 'Posting...' : 'Broadcast'}
                                </button>
                            </div>
                        </div>
                        <textarea
                            placeholder="Details about the event or policy..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-accent-peach focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all resize-none h-24"
                            value={announcement.content}
                            onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                            required
                        ></textarea>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {announcements.length > 0 ? (
                    announcements.map((ann) => {
                        const TypeIcon = getTypeIcon(ann.type);
                        return (
                            <div key={ann._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 hover:translate-y-[-2px] transition-all relative group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 ${getTypeStyles(ann.type)}`}>
                                                <TypeIcon size={12} /> {ann.type}
                                            </span>
                                            <span className="text-secondary text-xs font-bold flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(ann.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2">{ann.title}</h3>
                                        <p className="text-secondary leading-relaxed">{ann.content}</p>
                                    </div>
                                    {role === 'admin' && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Delete this announcement?')) {
                                                    try {
                                                        await api.delete(`/announcement/${ann._id}`);
                                                        setAnnouncements(prev => prev.filter(a => a._id !== ann._id));
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Failed to delete');
                                                    }
                                                }
                                            }}
                                            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                            title="Delete Announcement"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 text-secondary font-medium">
                        No announcements yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsScreen;
