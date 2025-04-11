import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiBarChart2 } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen, toggleSidebar, closeSidebar }, ref) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Users', icon: FiUsers, path: '/users' },
    { name: 'Settings', icon: FiSettings, path: '/settings' },
    { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
  ];

  const handleLinkClick = () => {
    // Only close sidebar on mobile
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <aside 
      ref={ref}
      className={`bg-gray-900 dark:bg-gray-950 text-white w-64 min-h-screen fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 ease-in-out z-20 pt-16`}
    >
      <div className="p-4">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-gray-800 dark:bg-gray-800 text-white' 
                    : 'hover:bg-gray-800 dark:hover:bg-gray-800'
                }`}
                onClick={handleLinkClick}
              >
                <link.icon size={24} className="mr-3" />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
});

export default Sidebar;