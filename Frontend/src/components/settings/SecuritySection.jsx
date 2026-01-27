import React from 'react';
import { Lock, Shield } from 'lucide-react';

const SecuritySection = () => (
  <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 opacity-80 pointer-events-none relative overflow-hidden">
    <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
      <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 font-bold text-secondary flex items-center gap-2">
        <Lock size={16} /> Security Settings Coming Soon
      </div>
    </div>

    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-accent-peach/10 rounded-full flex items-center justify-center text-accent-peach">
        <Shield size={20} />
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-primary">Security</h3>
        <p className="text-secondary text-sm">Manage password and security preferences</p>
      </div>
    </div>
  </section>
);

export default SecuritySection;
