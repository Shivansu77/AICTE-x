import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, Shield, Bell, Palette, Lock, Loader } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';
import ProfileSection from '../components/settings/ProfileSection';
import SecuritySection from '../components/settings/SecuritySection';
import NotificationSection from '../components/settings/NotificationSection';
import AppearanceSection from '../components/settings/AppearanceSection';
import PrivacySection from '../components/settings/PrivacySection';

const SettingsScreen = () => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [preferencesLoading, setPreferencesLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef(null);

    // Preferences state
    const [preferences, setPreferences] = useState({
        notificationPreferences: {},
        appearancePreferences: {},
        privacyPreferences: {},
        lastPasswordChange: null,
        twoFactorEnabled: false
    });

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

    // Fetch preferences on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setPreferencesLoading(false);
            return;
        }
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const { data } = await api.get('/user/preferences');
            setPreferences(data);
        } catch (error) {
            console.error('Failed to fetch preferences:', error);
        } finally {
            setPreferencesLoading(false);
        }
    };

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

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy & Data', icon: Lock }
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Settings className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-primary">Settings</h1>
                    <p className="text-secondary font-medium">Manage your account preferences</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {preferencesLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="animate-spin text-accent-blue" size={32} />
                    <span className="ml-3 text-secondary font-medium">Loading settings...</span>
                </div>
            ) : (
                <div className="grid gap-8">
                    {activeTab === 'profile' && (
                        <ProfileSection
                            user={user}
                            formData={formData}
                            fileInputRef={fileInputRef}
                            handleFileChange={handleFileChange}
                            handleUpdateProfile={handleUpdateProfile}
                            handleChange={handleChange}
                            loading={loading}
                        />
                    )}

                    {activeTab === 'security' && (
                        <SecuritySection
                            lastPasswordChange={preferences.lastPasswordChange}
                            twoFactorEnabled={preferences.twoFactorEnabled}
                            onUpdate={fetchPreferences}
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationSection
                            preferences={preferences.notificationPreferences}
                            onUpdate={fetchPreferences}
                        />
                    )}

                    {activeTab === 'appearance' && (
                        <AppearanceSection
                            preferences={preferences.appearancePreferences}
                            onUpdate={fetchPreferences}
                        />
                    )}

                    {activeTab === 'privacy' && (
                        <PrivacySection
                            preferences={preferences.privacyPreferences}
                            onUpdate={fetchPreferences}
                        />
                    )}
                </div>
            )}

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
