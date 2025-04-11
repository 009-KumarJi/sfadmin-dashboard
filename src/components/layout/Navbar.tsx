import React from 'react';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="bg-gray-800 dark:bg-gray-900 text-white h-16 flex items-center justify-between px-4 fixed top-0 w-full z-10">
      <div className="flex items-center">
        <button 
          className="lg:hidden mr-4 p-2"
          onClick={toggleSidebar}
          aria-label="Toggle mobile sidebar"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">SF Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-400"></div>
      </div>
    </nav>
  );
}

export default Navbar;