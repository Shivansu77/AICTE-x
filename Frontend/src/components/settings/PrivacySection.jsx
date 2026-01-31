import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, EyeOff, Users, Activity, Database, 
  Download, Trash2, AlertTriangle, CheckCircle, Loader,
  Lock, Globe, Building
} from 'lucide-react';
import api from '../../utils/api';

const PrivacySection = ({ preferences: initialPreferences, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    profileVisibility: 'institution',
    showEmail: false,
    showActivity: true,
    allowDataCollection: true,
    ...initialPreferences
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({ ...prev, ...initialPreferences }));
    }
  }, [initialPreferences]);

  const handleChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    setLoading(true);
    setSaved(false);
    
    try {
      await api.put('/user/preferences/privacy', newPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update privacy preferences:', error);
      setPreferences(preferences);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const { data } = await api.get('/user/export-data');
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password');
      return;
    }

    setDeleteLoading(true);
    try {
      await api.delete('/user/account', { data: { password: deletePassword } });
      alert('Account deleted successfully. You will be logged out.');
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const visibilityOptions = [
    { 
      value: 'public', 
      icon: Globe, 
      label: 'Public', 
      description: 'Anyone can view your profile',
      color: 'green'
    },
    { 
      value: 'institution', 
      icon: Building, 
      label: 'Institution Only', 
      description: 'Only people in your institution',
      color: 'blue'
    },
    { 
      value: 'private', 
      icon: Lock, 
      label: 'Private', 
      description: 'Only you can view your profile',
      color: 'gray'
    }
  ];

  return (
    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-primary">Privacy & Data</h3>
            <p className="text-secondary text-sm">Control your data and privacy settings</p>
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

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div>
          <label className="block text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Users size={16} /> Profile Visibility
          </label>
          <div className="grid grid-cols-3 gap-3">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = preferences.profileVisibility === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleChange('profileVisibility', option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? `border-${option.color}-400 bg-${option.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                    isSelected ? `bg-${option.color}-100 text-${option.color}-600` : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-secondary mt-1">{option.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Toggles */}
        <div className="space-y-3">
          {/* Show Email */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {preferences.showEmail ? <Eye size={18} className="text-blue-500" /> : <EyeOff size={18} className="text-gray-500" />}
                </div>
                <div>
                  <span className="font-bold text-primary block">Show Email Address</span>
                  <span className="text-xs text-secondary">Allow others to see your email</span>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.showEmail}
                  onChange={() => handleChange('showEmail', !preferences.showEmail)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.showEmail ? 'bg-accent-blue' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${
                    preferences.showEmail ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
          </div>

          {/* Show Activity */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Activity size={18} className={preferences.showActivity ? 'text-green-500' : 'text-gray-500'} />
                </div>
                <div>
                  <span className="font-bold text-primary block">Show Activity Status</span>
                  <span className="text-xs text-secondary">Let others see when you're active</span>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.showActivity}
                  onChange={() => handleChange('showActivity', !preferences.showActivity)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.showActivity ? 'bg-accent-blue' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${
                    preferences.showActivity ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
          </div>

          {/* Data Collection */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Database size={18} className={preferences.allowDataCollection ? 'text-purple-500' : 'text-gray-500'} />
                </div>
                <div>
                  <span className="font-bold text-primary block">Analytics & Improvements</span>
                  <span className="text-xs text-secondary">Help us improve by sharing usage data</span>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.allowDataCollection}
                  onChange={() => handleChange('allowDataCollection', !preferences.allowDataCollection)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.allowDataCollection ? 'bg-accent-blue' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${
                    preferences.allowDataCollection ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="pt-6 border-t border-gray-100">
          <h4 className="font-bold text-primary mb-4">Data Management</h4>
          
          <div className="space-y-3">
            {/* Export Data */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Download size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-primary block">Export Your Data</span>
                    <span className="text-xs text-secondary">Download all your data in JSON format</span>
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={exportLoading}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {exportLoading ? (
                    <><Loader className="animate-spin" size={14} /> Exporting...</>
                  ) : (
                    <><Download size={14} /> Export</>
                  )}
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Trash2 size={18} className="text-red-600" />
                  </div>
                  <div>
                    <span className="font-bold text-red-700 block">Delete Account</span>
                    <span className="text-xs text-red-600">Permanently delete your account and data</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Delete Account</h3>
                <p className="text-sm text-secondary">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-xl mb-4">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> Deleting your account will permanently remove all your data, 
                including your profile, queries, and preferences. This cannot be recovered.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-primary mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Your password"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deletePassword}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <><Loader className="animate-spin" size={16} /> Deleting...</>
                ) : (
                  <><Trash2 size={16} /> Delete Account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PrivacySection;
