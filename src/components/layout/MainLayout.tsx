import React, { useState, ReactNode, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AppLayout from './AppLayout';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  // Initialize with sidebar open in desktop and closed in mobile
  const isDesktop = window.innerWidth >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // New state for collapsed sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Track desktop/mobile state
  const [isDesktopView, setIsDesktopView] = useState(isDesktop);
  
  const toggleSidebar = () => {
    if (isDesktopView) {
      // In desktop mode: Open -> Collapsed -> Open cycle
      if (sidebarOpen && !sidebarCollapsed) {
        // If open, collapse it
        setSidebarCollapsed(true);
      } else if (sidebarOpen && sidebarCollapsed) {
        // If collapsed, open it fully
        setSidebarCollapsed(false);
      } else {
        // If closed, open it
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    } else {
      // In mobile: simply toggle open/closed
      setSidebarOpen(prevState => !prevState);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle resize to toggle between desktop and mobile modes
  useEffect(() => {
    const handleResize = () => {
      const wasDesktop = isDesktopView;
      const desktop = window.innerWidth >= 1024;
      setIsDesktopView(desktop);
      
      // When switching from desktop to tablet/mobile, close the sidebar
      if (wasDesktop && !desktop) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      }
      
      // When switching from mobile to desktop and sidebar is closed, open it
      if (!wasDesktop && desktop && !sidebarOpen) {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktopView, sidebarOpen]);

  // Handle clicks outside the sidebar to close it (mobile only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if sidebar is open and we're on mobile
      if (sidebarOpen && !isDesktopView) {
        // Check if the click was outside the sidebar and not on the toggle button
        if (sidebarRef.current && 
            !sidebarRef.current.contains(event.target as Node) && 
            !(event.target as Element).closest('button[aria-label="Toggle sidebar"]')) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, isDesktopView]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar - fixed at top */}
      <Navbar 
        toggleSidebar={toggleSidebar} 
        sidebarOpen={sidebarOpen} 
        sidebarCollapsed={sidebarCollapsed} 
      />
      
      {/* Main content area - flex container for sidebar and content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          closeSidebar={closeSidebar} 
          ref={sidebarRef}
          isCollapsed={sidebarCollapsed}
        />
        
        {/* Main content - adjust padding based on sidebar state */}
        <div className={`flex-1 transition-all duration-300 ${
          isDesktopView 
            ? (sidebarOpen 
                ? (sidebarCollapsed ? 'ml-16' : 'ml-64') 
                : 'ml-0') 
            : 'lg:ml-0'
        }`}>
          <div className="p-4 md:p-6 lg:p-8 text-gray-900 dark:text-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;