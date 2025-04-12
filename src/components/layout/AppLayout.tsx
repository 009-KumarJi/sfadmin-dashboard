import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}

export default AppLayout;