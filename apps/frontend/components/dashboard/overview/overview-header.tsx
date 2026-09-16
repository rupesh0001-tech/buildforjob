import React from 'react';

export function OverviewHeader({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
        Welcome back, {name} <span className="text-xl">👋</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what is happening with your job search today.</p>
    </div>
  );
}
