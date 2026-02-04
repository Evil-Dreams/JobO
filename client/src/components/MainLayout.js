import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function MainLayout({ children, activeTab, setActiveTab }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="bg-grid-pattern fixed inset-0 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-[281px] relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden">
                <img 
                  src="/iblis_logo.png" 
                  alt="JobO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold text-white">JobO</h1>
            </div>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-screen pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
