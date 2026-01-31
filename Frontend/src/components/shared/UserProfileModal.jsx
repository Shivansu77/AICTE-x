import React from 'react';
import { X, Mail, MapPin, Building, BookOpen, Calendar, Shield, GraduationCap, User, Ban, Trash2, ShieldCheck } from 'lucide-react';

const UserProfileModal = ({ user, onClose, onBlockUser, onDeleteUser, isAdmin, currentUserId }) => {
  if (!user) return null;

  const isCurrentUser = user._id === currentUserId;

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return <Shield size={16} />;
      case 'teacher':
      case 'faculty': return <User size={16} />;
      default: return <GraduationCap size={16} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case 'teacher':
      case 'faculty': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-r from-accent-blue via-accent-blue to-cyan-500 rounded-t-3xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
          
          {/* Avatar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-2xl font-black text-gray-500 dark:text-gray-300">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-8 px-8">
          {/* Name & Role */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {user.firstName} {user.lastName}
              {isCurrentUser && <span className="ml-2 text-sm text-gray-400">(You)</span>}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              {user.role}
            </span>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed mb-6 px-4">
              {user.bio}
            </p>
          )}

          {/* Info Grid */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
            </div>

            {/* College */}
            {user.college && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Building size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">College</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.college}</p>
                </div>
              </div>
            )}

            {/* Department */}
            {user.department && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Department</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.department}</p>
                </div>
              </div>
            )}

            {/* Designation */}
            {user.designation && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Designation</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.designation}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{user.location}</p>
                </div>
              </div>
            )}

            {/* Joined Date */}
            {user.createdAt && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Member Since</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {user.isActive !== undefined && (
            <div className="mt-6 text-center">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                user.isActive 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              }`}>
                {user.isActive ? '● Active User' : '● Blocked User'}
              </span>
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && !isCurrentUser && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Admin Actions</p>
              <div className="flex gap-3">
                <button
                  onClick={() => onBlockUser && onBlockUser(user)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    user.isActive 
                      ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60'
                  }`}
                >
                  {user.isActive ? <Ban size={18} /> : <ShieldCheck size={18} />}
                  {user.isActive ? 'Block User' : 'Unblock User'}
                </button>
                <button
                  onClick={() => onDeleteUser && onDeleteUser(user)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition-all"
                >
                  <Trash2 size={18} />
                  Delete User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
