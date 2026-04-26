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
        `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${isActive
          ? 'bg-lsfrs-red text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#1A1A2E] text-white w-64 flex flex-col z-50 transition-transform duration-300 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg leading-tight uppercase">LSFRS<br />Portal</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-6 border-b border-gray-800">
          <p className="text-sm text-gray-400 uppercase tracking-wider">{currentUser?.role}</p>
          <p className="font-semibold text-lg truncate mt-1">{currentUser?.name}</p>
          {currentUser?.stationId && (
            <p className="text-sm text-lsfrs-gold mt-1">Station: {currentUser.stationId}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
