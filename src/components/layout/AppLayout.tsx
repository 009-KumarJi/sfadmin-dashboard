import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 pt-16 lg:pl-64 transition-all duration-300">
      <div className="p-4 md:p-6 lg:p-8 w-full">
        {children}
      </div>
    </div>
  );
}

export default AppLayout;