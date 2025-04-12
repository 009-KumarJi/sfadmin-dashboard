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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="mt-4 sm:mt-0 space-x-3 flex flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeading;