import React from 'react';
import { User, Camera } from 'lucide-react';

const AvatarSection = ({ formData, user, fileInputRef, handleFileChange }) => (
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
);

export default AvatarSection;
