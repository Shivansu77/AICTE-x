import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Key, CheckCircle, AlertTriangle, Smartphone, Loader } from 'lucide-react';
import api from '../../utils/api';

const SecuritySection = ({ lastPasswordChange, twoFactorEnabled, onUpdate }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength(newPassword);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/user/change-password', {
        currentPassword,
        newPassword
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent-peach/10 rounded-full flex items-center justify-center text-accent-peach">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-primary">Security</h3>
          <p className="text-secondary text-sm">Manage password and security preferences</p>
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Key size={18} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Password</h4>
                <p className="text-xs text-secondary">
                  Last changed: {formatDate(lastPasswordChange)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 bg-accent-blue text-white font-bold rounded-xl hover:bg-accent-blue/90 transition-colors text-sm"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 pr-12"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 pr-12"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < strengthLevel ? strengthColors[strengthLevel - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      strengthLevel <= 2 ? 'text-red-500' : strengthLevel <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {strengthLabels[strengthLevel - 1] || 'Very Weak'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-300 bg-red-50'
                      : confirmPassword && confirmPassword === newPassword
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Message */}
              {message.text && (
                <div className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                className="w-full py-3 bg-gradient-to-r from-accent-blue to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader className="animate-spin" size={18} /> Updating...</>
                ) : (
                  <><Lock size={18} /> Update Password</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Smartphone size={18} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Two-Factor Authentication</h4>
                <p className="text-xs text-secondary">
                  {twoFactorEnabled ? 'Enabled - Your account is more secure' : 'Add an extra layer of security'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition-colors text-sm cursor-not-allowed"
                disabled
                title="Coming Soon"
              >
                {twoFactorEnabled ? 'Manage' : 'Enable'}
              </button>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
            <Shield size={16} /> Security Tips
          </h4>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>• Use a strong, unique password with letters, numbers, and symbols</li>
            <li>• Never share your password with anyone</li>
            <li>• Change your password regularly (every 3-6 months)</li>
            <li>• Enable two-factor authentication for extra security</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
