import React from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';

const InfoBanner = ({ isFaculty }) => (
  isFaculty ? (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
      <div>
        <h3 className="font-bold text-blue-800 text-sm">Faculty Instruction</h3>
        <p className="text-blue-600 text-sm mt-1">Select the subject you are teaching to view the curriculum, download the syllabus, or request updates for the next academic session.</p>
      </div>
    </div>
  ) : (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex items-start gap-3">
      <BookOpen className="w-5 h-5 text-emerald-600 mt-0.5" />
      <div>
        <h3 className="font-bold text-emerald-800 text-sm">Program Curriculum</h3>
        <p className="text-emerald-600 text-sm mt-1">Browse the valid list of subjects and approved syllabus for your ongoing semester.</p>
      </div>
    </div>
  )
);

export default InfoBanner;
