import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import ProfileSection from '../components/settings/ProfileSection';
import SecuritySection from '../components/settings/SecuritySection';

const SettingsScreen = () => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    // Form States
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        avatar: user.avatar || '',
        college: user.college || '',
        department: user.department || '',
        designation: user.designation || '',
        location: user.location || '',
        bio: user.bio || '',
    });

    useEffect(() => {
        // Pre-fill form when user data is available
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            avatar: user.avatar || '',
            college: user.college || '',
            department: user.department || '',
            designation: user.designation || '',
            location: user.location || '',
            bio: user.bio || '',
        });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for base64
                setMessage({ type: 'error', text: 'Image too large. Max 1MB.' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/user/profile', formData);

            // Update user context (which also updates localStorage)
            const updatedUser = response.data.user;
            setUser(updatedUser);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Update failed", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">

            {/* Tabs / Sections */}
            <div className="grid gap-8">

                <ProfileSection
                    user={user}
                    formData={formData}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handleUpdateProfile={handleUpdateProfile}
                    handleChange={handleChange}
                    loading={loading}
                />

                <SecuritySection />

                {/* Notifications */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent-green/10 rounded-full flex items-center justify-center text-accent-green">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-primary">Notification Preferences</h3>
                            <p className="text-secondary text-sm">Control what updates you receive</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-accent-yellow/5 rounded-xl cursor-pointer hover:bg-accent-yellow/10 transition-colors">
                            <span className="font-bold text-primary">Email Notifications</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent-blue" />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-accent-yellow/5 rounded-xl cursor-pointer hover:bg-accent-yellow/10 transition-colors">
                            <span className="font-bold text-primary">New Course Announcements</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-accent-blue" />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-accent-yellow/5 rounded-xl cursor-pointer hover:bg-accent-yellow/10 transition-colors">
                            <span className="font-bold text-primary">Curriculum Updates</span>
                            <input type="checkbox" className="w-5 h-5 accent-accent-blue" />
                        </label>
                    </div>
                </section>

            </div>

            {message.text && (
                <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl font-bold animate-fade-in-up ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default SettingsScreen;
