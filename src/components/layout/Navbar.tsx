import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen?: boolean;
  sidebarCollapsed?: boolean; // New prop to track if sidebar is collapsed in desktop mode
}

function Navbar({ toggleSidebar, sidebarOpen = false, sidebarCollapsed = false }: NavbarProps) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  // Track window resize to update desktop/mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getCurrentPageHeading = () => {
    switch(location.pathname) {
      case '/add-food':
        return 'Add Food';
      case '/list-foods':
        return 'List Foods';
      case '/orders':
        return 'Orders';
      default:
        return 'SF Admin Dashboard';
    }
  };
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white h-16 flex items-center justify-between px-3 sm:px-4 fixed top-0 w-full z-10 transition-colors duration-300 overflow-hidden">
      <div className="flex items-center overflow-hidden">
        <button 
          className="mr-2 sm:mr-4 p-2 text-gray-700 dark:text-white flex-shrink-0"
          onClick={handleToggleClick}
          aria-label="Toggle sidebar"
        >
          <div className="transform transition-transform duration-300">
            {isDesktop ? (
              sidebarOpen ? 
                (sidebarCollapsed ? <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />) 
                : <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <FiArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
            )}
          </div>  
        </button>
        <img src={assets.logo} alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 mr-2 flex-shrink-0" />
        <h1 className="text-lg sm:text-xl font-bold lg:mr-10 truncate">{getCurrentPageHeading()}</h1>
      </div>
    </nav>
  );
}

export default Navbar;