import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TopBar = ({ setIsMobileOpen, title = "Dashboard" }) => {
  const { currentUser } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="mr-4 lg:hidden text-gray-500 hover:text-lsfrs-red"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Can add notifications icon here if needed */}
        <div className="hidden sm:flex items-center">
          <div className="w-8 h-8 rounded-full bg-lsfrs-red/10 text-lsfrs-red flex items-center justify-center font-bold">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
