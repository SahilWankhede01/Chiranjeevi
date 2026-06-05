import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Logo from './Logo';

const parseNotification = (message) => {
  if (!message) return null;
  // Pattern: A new appointment has been requested by [fullName] for [preferredDate] at [preferredTime]. Reason/Symptoms: [disease]
  const bookingMatch = message.match(/A new appointment has been requested by (.*?) for (.*?) at (.*?)\. Reason\/Symptoms: (.*)$/);
  if (bookingMatch) {
    return {
      isBooking: true,
      patientName: bookingMatch[1],
      date: bookingMatch[2],
      time: bookingMatch[3],
      reason: bookingMatch[4]
    };
  }
  
  // Pattern: Appointment for [fullName] scheduled on [date] was cancelled by the patient.
  const cancelMatch = message.match(/Appointment for (.*?) scheduled on (.*?) was cancelled by the patient\./);
  if (cancelMatch) {
    return {
      isCancel: true,
      patientName: cancelMatch[1],
      date: cancelMatch[2],
      reason: 'Cancelled by Patient'
    };
  }
  
  return null;
};

const Navbar = () => {
  const { user, logout, notifications, fetchNotifications, markNotificationAsRead } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Poll every 30 seconds for new notifications (doctor role only)
  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const navigate = useNavigate();
  const location = useLocation();

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    showToast(language === 'mr' ? 'यशस्वीरीत्या लॉगआउट झाले!' : language === 'hi' ? 'सफलतापूर्वक लॉगआउट हुआ!' : 'Logged out successfully!', 'info');
    navigate('/');
    setIsOpen(false);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setLangOpen(false);
    setIsOpen(false);
  };

  const handleNotificationClick = async (id) => {
    await markNotificationAsRead(id);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('aboutDoctor'), path: '/#about' },
    { name: t('treatments'), path: '/#treatments' },
    { name: t('contact'), path: '/#contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b bg-white/90 dark:bg-zinc-950/90 text-slate-800 dark:text-zinc-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="w-11 h-11 transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-xl tracking-wide text-ayurveda-green-800 dark:text-zinc-50 leading-tight">
                  {t('clinicName')}
                </span>
                <span className="text-[9px] font-bold text-ayurveda-saffron-600 dark:text-ayurveda-saffron-400 uppercase tracking-[0.18em] mt-0.5">
                  {t('clinicSub')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="font-medium text-sm text-slate-600 hover:text-ayurveda-green-600 dark:text-zinc-300 dark:hover:text-ayurveda-green-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            
            <Link
              to={getDashboardPath()}
              className="bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 hover:from-ayurveda-green-700 hover:to-ayurveda-green-800 text-white font-semibold text-xs px-4.5 py-2.5 rounded-full shadow-md shadow-emerald-700/10 hover:shadow-lg transition-all duration-200 uppercase tracking-wider"
            >
              {t('bookNow')}
            </Link>
          </div>

          {/* User Controls & Switchers */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 transition-colors duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 flex items-center gap-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 transition-colors duration-200"
                title="Select Language"
              >
                <Globe size={20} />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 shadow-2xl py-1 z-50 animate-fade-in">
                  <button
                    onClick={() => selectLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${language === 'en' ? 'text-ayurveda-green-600 dark:text-ayurveda-green-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => selectLanguage('mr')}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${language === 'mr' ? 'text-ayurveda-green-600 dark:text-ayurveda-green-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}
                  >
                    मराठी
                  </button>
                  <button
                    onClick={() => selectLanguage('hi')}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${language === 'hi' ? 'text-ayurveda-green-600 dark:text-ayurveda-green-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown (Doctor Only) */}
            {user && user.role === 'doctor' && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 transition-colors duration-200 relative"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-85 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 shadow-2xl p-4 z-50 animate-fade-in max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200">{t('notifications')}</h4>
                      <span className="text-xs bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-slate-500">{unreadCount} unread</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-center text-slate-400 py-4">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => {
                          const parsed = parseNotification(n.message);
                          return (
                            <div
                              key={n._id}
                              className={`p-3 rounded-xl border text-left transition-all duration-200 ${n.isRead ? 'bg-slate-50/50 dark:bg-zinc-900/30 border-transparent text-slate-400' : 'bg-green-50/30 dark:bg-emerald-950/10 border-green-100 dark:border-emerald-900/20 text-slate-700 dark:text-zinc-300'}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-xs flex items-center gap-1.5">
                                  {parsed?.isBooking ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                  ) : parsed?.isCancel ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                                  )}
                                  {n.title}
                                </p>
                                {!n.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markNotificationAsRead(n._id);
                                    }}
                                    className="text-[10px] text-ayurveda-green-600 dark:text-ayurveda-green-400 font-bold hover:underline shrink-0 ml-2"
                                  >
                                    Mark Read
                                  </button>
                                )}
                              </div>

                              {parsed ? (
                                <div className="text-[11px] space-y-0.5 mt-1 font-medium">
                                  <p><span className="text-slate-400 dark:text-zinc-500 font-bold">Patient:</span> {parsed.patientName}</p>
                                  <p><span className="text-slate-400 dark:text-zinc-500 font-bold">Date & Time:</span> {parsed.date} {parsed.time ? `at ${parsed.time}` : ''}</p>
                                  <p><span className="text-slate-400 dark:text-zinc-500 font-bold">Reason:</span> {parsed.reason}</p>
                                </div>
                              ) : (
                                <p className="text-[11px] leading-relaxed mt-1">{n.message}</p>
                              )}
                              
                              <span className="text-[9px] text-slate-400 block mt-1.5">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-800"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-ayurveda-green-100 dark:bg-zinc-800 flex items-center justify-center text-ayurveda-green-700 dark:text-zinc-200 font-bold">
                      <User size={18} />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={14} />
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800/80"
                    >
                      <LogOut size={14} />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-ayurveda-green-600 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3 shadow-inner animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-850"
            >
              {link.name}
            </a>
          ))}

          {/* Language Selector */}
          <div className="py-2 border-t border-slate-100 dark:border-zinc-800">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Language</p>
            <div className="flex gap-2 px-3">
              <button
                onClick={() => selectLanguage('en')}
                className={`text-xs px-3 py-1.5 rounded-full border ${language === 'en' ? 'bg-ayurveda-green-500 text-white border-green-500 font-bold' : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => selectLanguage('mr')}
                className={`text-xs px-3 py-1.5 rounded-full border ${language === 'mr' ? 'bg-ayurveda-green-500 text-white border-green-500 font-bold' : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => selectLanguage('hi')}
                className={`text-xs px-3 py-1.5 rounded-full border ${language === 'hi' ? 'bg-ayurveda-green-500 text-white border-green-500 font-bold' : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-850"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-zinc-850"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 rounded-xl border text-sm font-semibold text-slate-700 dark:text-zinc-300 dark:border-zinc-800"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-ayurveda-green-600 text-white text-sm font-semibold hover:bg-ayurveda-green-700"
                >
                  {t('register')}
                </Link>
              </div>
            )}
            
            <Link
              to={getDashboardPath()}
              onClick={() => setIsOpen(false)}
              className="block text-center mt-3 bg-ayurveda-saffron-500 hover:bg-ayurveda-saffron-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg uppercase text-xs tracking-wider"
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
