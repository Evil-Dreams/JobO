import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
  User,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/dashboard'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: Briefcase,
      route: '/applications'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
      route: '/analytics'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      route: '/documents'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      route: '/profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      route: '/settings'
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-slate-950 border-r border-slate-800/50 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden">
              <img 
                src="/iblis_logo.png" 
                alt="JobO Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                JobO
              </h1>
              <p className="text-xs text-slate-500 font-medium">Career Copilot</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Main Menu
            </p>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.route);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full"
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-cyan-400' : 'group-hover:text-white'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout Button - ChatGPT Style */}
          <div className="mt-auto pt-4 px-4 pb-4">
            <div className="border-t border-slate-800/50 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border hover:border-red-500/30 group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

        </nav>
      </motion.aside>
    </>
  );
}
