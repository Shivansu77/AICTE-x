import React from 'react';
import { GitPullRequest } from 'lucide-react';

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-secondary p-10">
    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-5 text-accent-blue dark:text-blue-400">
      <GitPullRequest size={36} />
    </div>
    <h3 className="text-xl font-black text-primary mb-2">Select a Request</h3>
    <p className="text-sm text-secondary text-center max-w-sm">
      Choose a request from the left queue to open the AI review workspace.
    </p>
  </div>
);

export default EmptyState;
