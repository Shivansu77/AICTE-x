import React from 'react';
import { GitPullRequest } from 'lucide-react';

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-secondary/40">
    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
      <GitPullRequest size={48} />
    </div>
    <h3 className="text-xl font-bold text-primary mb-2">Select a Request</h3>
    <p className="font-medium">Review pending changes from the sidebar</p>
  </div>
);

export default EmptyState;
