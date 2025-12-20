import React, { useState, useRef } from 'react';
import { User, Lock, Bell, Save, Shield, Mail, Upload, Camera, MapPin, Briefcase, BookOpen } from 'lucide-react';
import api from '../utils/api';

const SettingsScreen = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
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

            // Update local storage and state
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
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

                {/* Profile Settings */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent-blue/10 rounded-full flex items-center justify-center text-accent-blue">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-primary">Profile Information</h3>
                            <p className="text-secondary text-sm">Update your personal and professional details</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center sm:flex-row gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-accent-yellow/10 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-secondary/50" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-accent-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Camera size={14} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <h4 className="font-bold text-lg">{user.firstName} {user.lastName}</h4>
                                <p className="text-secondary text-sm mb-2">{user.role}</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-accent-blue text-sm font-bold hover:underline"
                                >
                                    Change Avatar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-bold text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>

                            {/* Professional Details */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1 flex items-center gap-1"><Briefcase size={14} /> Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="e.g. Senior Professor"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1 flex items-center gap-1"><BookOpen size={14} /> Department / Subject</label>
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="e.g. Computer Science"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-secondary ml-1 flex items-center gap-1"><Briefcase size={14} /> College / University</label>
                                <input
                                    type="text"
                                    name="college"
                                    placeholder="e.g. Indian Institute of Technology, Delhi"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-secondary ml-1 flex items-center gap-1"><MapPin size={14} /> Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. New Delhi, India"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all placeholder:text-secondary/50"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-secondary ml-1">Bio</label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-accent-yellow/5 border-2 border-transparent focus:border-accent-blue focus:bg-white rounded-xl py-3 px-4 font-medium text-primary outline-none transition-all placeholder:text-secondary/50 resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 pl-12 pr-4 font-medium text-secondary outline-none cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-secondary/60 ml-1">Email cannot be changed. Contact admin for assistance.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-accent-blue text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Security Settings */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 opacity-80 pointer-events-none relative overflow-hidden">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
                        <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 font-bold text-secondary flex items-center gap-2">
                            <Lock size={16} /> Security Settings Coming Soon
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent-peach/10 rounded-full flex items-center justify-center text-accent-peach">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold text-primary">Security</h3>
                            <p className="text-secondary text-sm">Manage your password and security</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4" disabled />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1">New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4" disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary ml-1">Confirm Password</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4" disabled />
                            </div>
                        </div>
                    </div>
                </section>

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
