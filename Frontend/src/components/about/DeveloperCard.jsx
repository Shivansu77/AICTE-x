import React from 'react';
import { Github, MapPin, ExternalLink } from 'lucide-react';
import BentoCard from './BentoCard';

const DeveloperCard = ({ developer, delay = 0 }) => (
  <BentoCard delay={delay} className="group hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-card">
    <div className="flex items-start gap-4">
      <img
        src={developer.avatar_url || `https://ui-avatars.com/api/?name=${developer.name || developer.login}&background=random`}
        alt={developer.login}
        className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow border-2 border-white dark:border-border-color"
      />
      <div className="flex-1 min-w-0 pt-1">
        <h3 className="text-lg font-bold text-primary truncate">{developer.name || developer.login}</h3>
        <a href={`https://github.com/${developer.login}`} target="_blank" rel="noreferrer" className="text-accent-blue text-xs font-bold hover:underline flex items-center gap-1 mb-1">
          @{developer.login} <ExternalLink size={10} />
        </a>
        {developer.location && (
          <div className="flex items-center gap-1 text-[10px] text-secondary font-medium">
            <MapPin size={10} /> {developer.location}
          </div>
        )}
      </div>
    </div>

    <p className="mt-4 text-secondary text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">
      {developer.bio || "Passionate developer contributing to the future of education technology."}
    </p>

    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-border-color flex justify-between items-center">
      <div className="flex gap-1.5 opacity-60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
      </div>
      <a
        href={`https://github.com/${developer.login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white dark:bg-card border border-gray-200 dark:border-border-color rounded-lg hover:bg-gray-50 dark:hover:bg-border-color text-primary transition-all shadow-sm hover:shadow"
      >
        <Github size={16} />
      </a>
    </div>
  </BentoCard>
);

export default DeveloperCard;
