import React from 'react';
import { Briefcase, BookOpen, MapPin, Mail, Save } from 'lucide-react';

const ProfileForm = ({ formData, handleChange, handleUpdateProfile, loading }) => (
  <form onSubmit={handleUpdateProfile} className="space-y-8">
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
);

export default ProfileForm;
