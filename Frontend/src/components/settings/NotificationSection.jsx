import React, { useState, useEffect } from 'react';
import { Bell, Mail, BookOpen, FileText, Calendar, Megaphone, CheckCircle, Loader } from 'lucide-react';
import api from '../../utils/api';

const NotificationSection = ({ preferences: initialPreferences, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    courseAnnouncements: true,
    curriculumUpdates: true,
    requestUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
    ...initialPreferences
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({ ...prev, ...initialPreferences }));
    }
  }, [initialPreferences]);

  const handleToggle = async (key) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    
    setLoading(true);
    setSaved(false);
    
    try {
      await api.put('/user/preferences/notifications', newPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      // Revert on error
      setPreferences(preferences);
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: 'emailNotifications',
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      color: 'blue'
    },
    {
      key: 'courseAnnouncements',
      icon: Megaphone,
      title: 'Course Announcements',
      description: 'Get notified about new course announcements',
      color: 'green'
    },
    {
      key: 'curriculumUpdates',
      icon: BookOpen,
      title: 'Curriculum Updates',
      description: 'Notifications when syllabi are updated',
      color: 'purple'
    },
    {
      key: 'requestUpdates',
      icon: FileText,
      title: 'Request Status Updates',
      description: 'Get notified when your requests are reviewed',
      color: 'orange'
    },
    {
      key: 'weeklyDigest',
      icon: Calendar,
      title: 'Weekly Digest',
      description: 'Receive a weekly summary of activities',
      color: 'teal'
    },
    {
      key: 'marketingEmails',
      icon: Bell,
      title: 'Marketing & Promotions',
      description: 'Occasional updates about new features',
      color: 'pink'
    }
  ];

  const getColorClasses = (color, enabled) => {
    const colors = {
      blue: enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200',
      green: enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200',
      purple: enabled ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200',
      orange: enabled ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200',
      teal: enabled ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200',
      pink: enabled ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color, enabled) => {
    if (!enabled) return 'text-gray-400';
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
      teal: 'text-teal-500',
      pink: 'text-pink-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-green/10 rounded-full flex items-center justify-center text-accent-green">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-primary">Notification Preferences</h3>
            <p className="text-secondary text-sm">Control what updates you receive</p>
          </div>
        </div>
        
        {(loading || saved) && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            saved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {loading ? (
              <><Loader className="animate-spin" size={14} /> Saving...</>
            ) : (
              <><CheckCircle size={14} /> Saved</>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          const enabled = preferences[option.key];
          
          return (
            <label
              key={option.key}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all hover:shadow-sm ${
                getColorClasses(option.color, enabled)
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  enabled ? 'bg-white shadow-sm' : 'bg-gray-100'
                }`}>
                  <Icon size={18} className={getIconColor(option.color, enabled)} />
                </div>
                <div>
                  <span className={`font-bold block ${enabled ? 'text-primary' : 'text-gray-500'}`}>
                    {option.title}
                  </span>
                  <span className="text-xs text-secondary">{option.description}</span>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleToggle(option.key)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  enabled ? 'bg-accent-blue' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${
                    enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
        <button
          onClick={async () => {
            const allOn = {
              emailNotifications: true,
              courseAnnouncements: true,
              curriculumUpdates: true,
              requestUpdates: true,
              weeklyDigest: true,
              marketingEmails: true
            };
            setPreferences(allOn);
            setLoading(true);
            try {
              await api.put('/user/preferences/notifications', allOn);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            } catch (e) { console.error(e); }
            setLoading(false);
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          Enable All
        </button>
        <button
          onClick={async () => {
            const essentialOnly = {
              emailNotifications: true,
              courseAnnouncements: false,
              curriculumUpdates: false,
              requestUpdates: true,
              weeklyDigest: false,
              marketingEmails: false
            };
            setPreferences(essentialOnly);
            setLoading(true);
            try {
              await api.put('/user/preferences/notifications', essentialOnly);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            } catch (e) { console.error(e); }
            setLoading(false);
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          Essential Only
        </button>
        <button
          onClick={async () => {
            const allOff = {
              emailNotifications: false,
              courseAnnouncements: false,
              curriculumUpdates: false,
              requestUpdates: false,
              weeklyDigest: false,
              marketingEmails: false
            };
            setPreferences(allOff);
            setLoading(true);
            try {
              await api.put('/user/preferences/notifications', allOff);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            } catch (e) { console.error(e); }
            setLoading(false);
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          Disable All
        </button>
      </div>
    </section>
  );
};

export default NotificationSection;
