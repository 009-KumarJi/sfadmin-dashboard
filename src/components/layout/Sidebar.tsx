import React, { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPlusCircle, FiList, FiShoppingCart } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isCollapsed?: boolean; // New prop for desktop collapsed state
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen, toggleSidebar, closeSidebar, isCollapsed = false }, ref) => {
  const location = useLocation();
  const isDesktop = window.innerWidth >= 1024;
  
  const sidebarLinks = [
    { name: 'Add Food', icon: FiPlusCircle, path: '/add-food' },
    { name: 'List Foods', icon: FiList, path: '/list-foods' },
    { name: 'Orders', icon: FiShoppingCart, path: '/orders' },
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
      className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
        ${isDesktop 
          ? isOpen 
            ? isCollapsed 
              ? 'w-16 translate-x-0 lg:block' // Collapsed state for desktop (icons only)
              : 'w-64 translate-x-0 lg:block' // Full state for desktop
            : '-translate-x-full lg:hidden' 
          : isOpen 
            ? 'w-64 translate-x-0' // Mobile open
            : 'w-64 -translate-x-full' // Mobile closed
        } 
        h-full border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out z-20 fixed`}
    >
      <div className={`${isCollapsed && isDesktop ? 'p-2' : 'p-4'} h-full`}>
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`flex items-center ${isCollapsed && isDesktop ? 'p-2 justify-center' : 'p-3'} rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-blue-50 text-blue-600 font-medium dark:bg-gray-700 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <link.icon size={24} className={isCollapsed && isDesktop ? '' : 'mr-3'} />
                {(!isCollapsed || !isDesktop) && <span>{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
});

export default Sidebar;