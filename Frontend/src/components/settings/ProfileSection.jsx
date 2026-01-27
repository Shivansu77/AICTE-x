import React from 'react';
import { User } from 'lucide-react';
import AvatarSection from './AvatarSection';
import ProfileForm from './ProfileForm';

const ProfileSection = ({ user, formData, fileInputRef, handleFileChange, handleUpdateProfile, handleChange, loading }) => (
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

    <AvatarSection
      formData={formData}
      user={user}
      fileInputRef={fileInputRef}
      handleFileChange={handleFileChange}
    />

    <ProfileForm
      formData={formData}
      handleChange={handleChange}
      handleUpdateProfile={handleUpdateProfile}
      loading={loading}
    />
  </section>
);

export default ProfileSection;
