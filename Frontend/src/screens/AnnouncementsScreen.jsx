import React, { useEffect, useState } from 'react';
import announcementImg from '../assets/announcement.png';
import api from '../utils/api';
import AnnouncementHeader from '../components/announcements/AnnouncementHeader';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import AnnouncementCard from '../components/announcements/AnnouncementCard';

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
            <AnnouncementHeader image={announcementImg} />
            {/* Admin Only: Post Announcement Form */}
            {role === 'admin' && (
                <AnnouncementForm
                    announcement={announcement}
                    setAnnouncement={setAnnouncement}
                    posting={posting}
                    handlePostAnnouncement={handlePostAnnouncement}
                />
            )}

            <div className="grid gap-6">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <AnnouncementCard
                            key={ann._id}
                            announcement={ann}
                            role={role}
                            onDelete={async () => {
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
                        />
                    ))
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
