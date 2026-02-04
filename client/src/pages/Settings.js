import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Trash2,
  LogOut,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    interviewReminders: true,
    autoSave: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('jobo-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobo-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Download data functionality commented out for future use
  // const downloadData = () => {
  //   const data = {
  //     settings: settings,
  //     exportDate: new Date().toISOString(),
  //     version: '1.0'
  //   };
  //   
  //   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `jobo-data-${new Date().toISOString().split('T')[0]}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  const deleteAllData = () => {
    if (window.confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      localStorage.removeItem('jobo-settings');
      setSettings({
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        interviewReminders: true,
        autoSave: true
      });
      alert('All settings have been reset successfully');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">
          Customize your preferences
        </p>
      </div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
      >
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          Notifications
        </h2>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get notifications on your device' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive weekly summary of your progress' },
            { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Reminders before your interviews' }
          ].map((notif) => {
            const isEnabled = settings[notif.key];
            return (
              <div
                key={notif.key}
                className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800/30 rounded-lg hover:border-slate-700/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{notif.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                </div>
                <button
                  onClick={() => toggleSetting(notif.key)}
                  className="focus:outline-none transition-transform"
                >
                  {isEnabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-600" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6 space-y-6"
      >
        <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>

        <div className="space-y-3">
          <button 
            onClick={deleteAllData}
            className="w-full flex items-center justify-between p-4 bg-slate-950/50 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-rose-400" />
              <div className="text-left">
                <p className="font-medium text-white group-hover:text-rose-400">Reset Settings</p>
                <p className="text-xs text-slate-500 mt-0.5">Reset all settings to default</p>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-rose-400">→</span>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-slate-950/50 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-400" />
              <div className="text-left">
                <p className="font-medium text-white group-hover:text-rose-400">Logout</p>
                <p className="text-xs text-slate-500 mt-0.5">Sign out from your account</p>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-rose-400">→</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
