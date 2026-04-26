import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2, LayoutDashboard, FileText, Settings, Users,
  Menu, X, LogOut, ShieldCheck, FileCheck, ClipboardList, Activity
} from 'lucide-react';

const officerLinks = [
  { to: '/officer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/officer/inspection/new', icon: ClipboardList, label: 'New Inspection' },
  { to: '/officer/certificates', icon: FileCheck, label: 'Certificates' },
  { to: '/officer/settings', icon: Settings, label: 'Settings' }
];

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/inspections', icon: FileText, label: 'Inspections' },
  { to: '/admin/certificates', icon: FileCheck, label: 'Certificates' },
  { to: '/admin/stations', icon: Building2, label: 'Stations' },
  { to: '/admin/users', icon: Users, label: 'Officers' }
];

const technicalLinks = [
  { to: '/technical/dashboard', icon: Activity, label: 'System Health' },
  { to: '/technical/logs', icon: FileText, label: 'Activity Logs' },
  { to: '/technical/users', icon: Users, label: 'User Admin' },
  { to: '/technical/stations', icon: Building2, label: 'Station Admin' }
];

export const TopBar = ({ setIsMobileOpen, title = "Dashboard" }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="font-bold text-gray-800 text-lg">{title}</h1>
      <div />
    </header>
  );
};

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout } = useAuth();

  let links = [];
  if (currentUser?.role === 'officer') links = officerLinks;
  else if (currentUser?.role === 'admin') links = adminLinks;
  else if (currentUser?.role === 'technical') links = technicalLinks;

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={() => setIsMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-200 group ${isActive
          ? 'bg-lsfrs-red text-white shadow-lg shadow-red-900/20'
          : 'text-gray-500 hover:bg-red-50 hover:text-lsfrs-red'
        }`
      }
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110`} />
      <span className="font-semibold tracking-tight">{label}</span>
    </NavLink>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-gray-100 text-gray-900 w-64 flex flex-col z-50 transition-transform duration-300 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto shadow-sm
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-lsfrs-red rounded flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg leading-tight uppercase text-gray-800">LSFRS</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 border-b border-gray-50 bg-gray-50/50">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{currentUser?.role}</p>
          <p className="font-bold text-gray-900 truncate mt-1">{currentUser?.name}</p>
          {currentUser?.stationId && (
            <p className="text-sm text-lsfrs-red font-medium mt-1">Station: {currentUser.stationId}</p>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
