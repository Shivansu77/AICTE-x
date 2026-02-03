import React from 'react';
import { motion } from 'framer-motion';
import { Github, MapPin, ExternalLink, Code, Sparkles } from 'lucide-react';

const DeveloperCard = ({ developer, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
  >
    {/* Background Decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
    
    {/* Header */}
    <div className="relative flex items-start gap-4">
      <div className="relative">
        <img
          src={developer.avatar_url || `https://ui-avatars.com/api/?name=${developer.name || developer.login}&background=random`}
          alt={developer.login}
          className="w-18 h-18 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-shadow ring-2 ring-white dark:ring-gray-700"
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
          <Code size={12} className="text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {developer.name || developer.login}
        </h3>
        <a 
          href={`https://github.com/${developer.login}`} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 text-sm font-medium hover:underline"
        >
          @{developer.login} <ExternalLink size={12} />
        </a>
        {developer.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <MapPin size={12} /> {developer.location}
          </div>
        )}
      </div>
    </div>

    {/* Bio */}
    <p className="relative mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5em]">
      {developer.bio || "Passionate developer contributing to the future of education technology."}
    </p>

    {/* Footer */}
    <div className="relative mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400">
          <Sparkles size={10} /> Developer
        </span>
      </div>
      
      <a
        href={`https://github.com/${developer.login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg group/btn"
      >
        <Github size={16} />
        <span className="text-xs font-bold">View Profile</span>
      </a>
    </div>
  </motion.div>
);

export default DeveloperCard;
