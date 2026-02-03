import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

const UniversityCard = ({ university, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
  >
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Badge */}
    <div className="absolute top-3 right-3">
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-[10px] font-bold text-white shadow-sm">
        <Award size={10} /> Premier
      </span>
    </div>

    <div className="relative text-center">
      {/* Logo Container */}
      <div className="relative mx-auto mb-4 w-20 h-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
        <div className="relative w-full h-full bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-3 shadow-md border border-gray-100 dark:border-gray-600 group-hover:scale-105 transition-transform">
          <img src={university.logo} alt={university.name} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Info */}
      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {university.name}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{university.description}</p>

      {/* Action */}
      <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
        Learn More <ExternalLink size={12} />
      </button>
    </div>
  </motion.div>
);

export default UniversityCard;
