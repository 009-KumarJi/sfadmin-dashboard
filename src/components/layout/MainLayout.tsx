import React, { useState, ReactNode, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AppLayout from './AppLayout';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle clicks outside the sidebar to close it (mobile only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if sidebar is open and we're on mobile
      if (sidebarOpen && window.innerWidth < 1024) {
        // Check if the click was outside the sidebar
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar} 
        ref={sidebarRef}
      />
      <AppLayout>
        {children}
      </AppLayout>
    </div>
  );
}

export default MainLayout;