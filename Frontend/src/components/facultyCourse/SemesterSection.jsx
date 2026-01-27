import React from 'react';
import { Database } from 'lucide-react';
import SubjectCard from './SubjectCard';

const SemesterSection = ({ semester, subjects, isFaculty, canSeed, onSeed, getRequestStatus, onOpenSubject }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">{semester}</div>
      Semester {semester}
    </h3>

    {subjects.length === 0 ? (
      <div className="pl-8 flex items-center gap-4">
        <p className="text-sm text-gray-400">No subjects defined.</p>
        {isFaculty && canSeed && (
          <button onClick={onSeed} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
            <Database size={12} /> Seed Defaults
          </button>
        )}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-8">
        {subjects.map(subject => {
          const latestReq = getRequestStatus(subject._id);
          return (
            <SubjectCard
              key={subject._id}
              subject={subject}
              latestReq={latestReq}
              onOpen={() => onOpenSubject(subject._id)}
            />
          );
        })}
      </div>
    )}
  </div>
);

export default SemesterSection;
