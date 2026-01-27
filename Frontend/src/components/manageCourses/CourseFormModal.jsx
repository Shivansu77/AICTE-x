import React from 'react';
import { Layers } from 'lucide-react';

const CourseFormModal = ({ showForm, editingId, formData, setFormData, handleCreateOrUpdateCourse, setShowForm }) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-primary">{editingId ? 'Edit Master Course' : 'New Master Course'}</h2>
            <p className="text-secondary text-sm font-medium">Standardize the academic program details.</p>
          </div>
          <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold text-secondary">✕</button>
        </div>
        <form onSubmit={handleCreateOrUpdateCourse} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Course Title</label>
              <input
                required
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all placeholder:font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Course Code</label>
              <input
                required
                type="text"
                placeholder="e.g. BTECH-CSE"
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all uppercase placeholder:font-medium"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Department</label>
              <input
                required
                type="text"
                placeholder="e.g. Computer Science"
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all placeholder:font-medium"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Type</label>
              <div className="relative">
                <select
                  className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Degree">Degree Program</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  <Layers size={18} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-secondary uppercase tracking-widest mb-3 ml-1">Credits</label>
              <input
                required
                type="number"
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] font-bold text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 border-2 border-transparent focus:border-accent-blue/20 transition-all"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all"
            >
              {editingId ? 'Update Master Course' : 'Create Master Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;
