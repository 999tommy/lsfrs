import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/inspection/new')) return 'New Inspection';
    if (pathname.includes('/inspections')) return 'Inspections';
    if (pathname.includes('/certificates')) return 'Certificates';
    if (pathname.includes('/stations')) return 'Stations';
    if (pathname.includes('/users')) return 'Users';
    if (pathname.includes('/logs')) return 'Activity Logs';
    if (pathname.includes('/settings')) return 'Settings';
    return 'LSFRS Portal';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar 
          setIsMobileOpen={setIsMobileOpen} 
          title={getPageTitle(location.pathname)} 
        />
        
        <main className="flex-1 relative overflow-x-hidden overflow-y-auto">
          {/* Background Layer */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
            style={{ backgroundImage: "url('/background2.jpg')" }}
          />
          {/* Overlay Layer */}
          <div className="absolute inset-0 z-10 bg-gray-50/90 backdrop-blur-[1px]" />

          {/* Content Layer */}
          <div className="relative z-20 p-4 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
