import React from 'react';
import { Shield, GraduationCap, User } from 'lucide-react';

const RoleBadge = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1">
          <Shield size={10} /> Admin
        </span>
      );
    case 'teacher':
    case 'faculty':
      return (
        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1">
          <User size={10} /> Faculty
        </span>
      );
    default:
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1">
          <GraduationCap size={10} /> Student
        </span>
      );
  }
};

export default RoleBadge;
