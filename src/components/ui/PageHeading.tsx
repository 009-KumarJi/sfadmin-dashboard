import React from 'react';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({ 
  title, 
  subtitle, 
  actions 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="min-w-0 flex-shrink">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:space-x-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeading;