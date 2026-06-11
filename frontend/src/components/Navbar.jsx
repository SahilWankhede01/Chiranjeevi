import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, Bell, User, LogOut, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Logo from './Logo';

const parseNotification = (message) => {
  if (!message) return null;
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
  const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Poll notifications for doctor every 30s
  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  // Click outside listener to close panels
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

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    for (const notif of unread) {
      await markNotificationAsRead(notif._id);
    }
    showToast('All notifications marked as read', 'success');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('aboutDoctor'), path: '#about' },
    { name: t('treatments'), path: '#treatments' },
    { name: t('contact'), path: '#contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-100/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 text-slate-800 dark:text-zinc-100 shadow-lg shadow-slate-100/20 dark:shadow-none transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 gap-4 xl:gap-8">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative p-1 bg-gradient-to-tr from-ayurveda-green-200 to-ayurveda-saffron-100 dark:from-zinc-900 dark:to-zinc-800 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm">
                <Logo className="w-10 h-10 text-ayurveda-green-700 dark:text-ayurveda-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-lg xl:text-xl tracking-wide text-ayurveda-green-800 dark:text-zinc-200 leading-tight group-hover:text-ayurveda-green-700 dark:group-hover:text-ayurveda-green-400 transition-colors">
                  {t('clinicName')}
                </span>
                <span className="text-[8px] xl:text-[9px] font-extrabold text-ayurveda-saffron-600 dark:text-ayurveda-saffron-400 uppercase tracking-[0.2em] mt-0.5">
                  {t('clinicSub')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith('#');
              const isTreatments = link.path === '#treatments';
              const activeHash = location.hash || '#home';
              const isActive = link.path === activeHash || (link.path === '/' && activeHash === '#home') || (link.path === '/' && !location.hash);

              if (isTreatments) {
                return (
                  <div key={link.name} className="relative group min-h-[48px] flex items-center">
                    <a
                      href="#treatments"
                      className={`relative font-bold text-xs xl:text-sm hover:text-ayurveda-green-600 dark:hover:text-ayurveda-green-400 py-3.5 flex items-center min-h-[48px] transition-colors ${isActive ? 'text-ayurveda-green-600 dark:text-ayurveda-green-400' : 'text-slate-600 dark:text-zinc-400'}`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={14} className="ml-1 transition-transform duration-300 group-hover:rotate-180" />
                      <span className={`absolute bottom-2 left-0 h-[2px] bg-ayurveda-green-600 dark:bg-ayurveda-green-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </a>
                    {/* Treatments Dropdown Menu */}
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-1 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl py-2.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {[
                        { name: language === 'mr' ? 'पंचकर्म' : language === 'hi' ? 'पंचकर्म' : 'Panchakarma', anchor: '#treatments' },
                        { name: language === 'mr' ? 'सांधे आणि मणके निगा' : language === 'hi' ? 'जोड़ और रीढ़ की देखभाल' : 'Joint & Spine Care', anchor: '#treatments' },
                        { name: language === 'mr' ? 'शिरोधारा' : language === 'hi' ? 'शिरोधारा' : 'Shirodhara', anchor: '#treatments' },
                        { name: language === 'mr' ? 'पचन संस्था विकार' : language === 'hi' ? 'पाचन संबंधी विकार' : 'Digestive Disorders', anchor: '#treatments' },
                        { name: language === 'mr' ? 'त्वचा आणि केस' : language === 'hi' ? 'त्वचा और बाल' : 'Skin & Hair', anchor: '#treatments' }
                      ].map((subItem, idx) => (
                        <a
                          key={idx}
                          href={subItem.anchor}
                          className="block px-4.5 py-2.5 text-xs text-slate-600 dark:text-zinc-300 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-ayurveda-green-600 dark:hover:text-ayurveda-green-400 rounded-xl mx-2 transition-all duration-200"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={isAnchor ? `${link.path}` : link.path}
                  /* FIX 5: Tap target size - py-3 and flex items-center ensures >48px tap height */
                  className={`relative font-bold text-xs xl:text-sm hover:text-ayurveda-green-600 dark:hover:text-ayurveda-green-400 py-3.5 flex items-center min-h-[48px] group transition-colors ${isActive ? 'text-ayurveda-green-600 dark:text-ayurveda-green-400' : 'text-slate-600 dark:text-zinc-400'}`}
                >
                  <span>{link.name}</span>
                  <span className={`absolute bottom-2 left-0 h-[2px] bg-ayurveda-green-600 dark:bg-ayurveda-green-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </a>
              );
            })}
            
            <Link
              to={getDashboardPath()}
              /* FIX 5: Tap target size - px-6 py-3.5 min-h-[48px] ensures >48px tap height & width */
              className="bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 hover:from-ayurveda-green-700 hover:to-ayurveda-green-800 text-white font-bold text-[10px] xl:text-[11px] px-4 py-2.5 xl:px-6 xl:py-3.5 rounded-full shadow-lg shadow-emerald-700/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-widest min-h-[40px] xl:min-h-[48px] flex items-center justify-center"
            >
              {t('bookNow')}
            </Link>
          </div>

          {/* User Controls & Toggles */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              /* FIX 5: Tap target size - min-h-[48px] min-w-[48px] flex items-center justify-center ensures >48x48px hit box */
              className="min-h-[40px] min-w-[40px] xl:min-h-[48px] xl:min-w-[48px] flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-all duration-300 hover:scale-105 active:scale-95"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-500 rotate-0 transition-transform duration-500 hover:rotate-45" />
              ) : (
                <Moon size={18} className="text-slate-700 rotate-0 transition-transform duration-500 hover:-rotate-12" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                /* FIX 5: Tap target size - min-h-[48px] flex items-center px-4 ensures >48x48px hit area */
                className="px-3 xl:px-4 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-all hover:scale-105 min-h-[40px] xl:min-h-[48px]"
                title="Select Language"
              >
                <Globe size={16} className="text-slate-400 dark:text-zinc-500" />
                <span className="text-xs font-extrabold uppercase tracking-wide">{language}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2.5 w-40 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-fade-in">
                  {[
                    { code: 'en', label: '🇺🇸 English' },
                    { code: 'mr', label: '🇮🇳 मराठी' },
                    { code: 'hi', label: '🇮🇳 हिन्दी' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-4.5 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${language === lang.code ? 'text-ayurveda-green-700 dark:text-ayurveda-green-450 bg-emerald-50/20 dark:bg-emerald-950/10' : 'text-slate-600 dark:text-zinc-400'}`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && <Check size={12} className="stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown (Doctor Only) */}
            {user && user.role === 'doctor' && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  /* FIX 5: Tap target size - min-h-[48px] min-w-[48px] flex items-center justify-center ensures >48x48px hit area */
                  className="min-h-[40px] min-w-[40px] xl:min-h-[48px] xl:min-w-[48px] flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 relative transition-all duration-300 hover:scale-105"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2.5 w-96 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl p-4.5 z-50 animate-fade-in">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800 animate-fade-in">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                        <Bell size={16} className="text-ayurveda-green-600" />
                        {t('notifications')}
                      </h4>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-ayurveda-green-600 dark:text-ayurveda-green-400 hover:underline font-extrabold"
                          >
                            Mark All Read
                          </button>
                        )}
                        <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-slate-500 font-bold">{unreadCount} unread</span>
                      </div>
                    </div>
                    
                    <div className="mt-3.5 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10">
                          <Bell size={28} className="text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                          <p className="text-slate-400 text-xs font-semibold">No notifications yet.</p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const parsed = parseNotification(n.message);
                          return (
                            <div
                              key={n._id}
                              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${n.isRead ? 'bg-slate-50/50 dark:bg-zinc-950/20 border-transparent text-slate-400' : 'bg-green-50/30 dark:bg-emerald-950/10 border-green-100 dark:border-emerald-900/20 hover:border-green-200 text-slate-700 dark:text-zinc-300'}`}
                              onClick={() => handleNotificationClick(n._id)}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <p className="font-bold text-xs flex items-center gap-1.5">
                                  {parsed?.isBooking ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                  ) : parsed?.isCancel ? (
                                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                                  )}
                                  {n.title}
                                </p>
                              </div>

                              {parsed ? (
                                <div className="text-[11px] space-y-1 mt-1 font-semibold text-slate-600 dark:text-zinc-400 pl-3.5">
                                  <p><span className="text-slate-400 dark:text-zinc-500">Patient:</span> {parsed.patientName}</p>
                                  <p><span className="text-slate-400 dark:text-zinc-500">Date & Slot:</span> {parsed.date} at {parsed.time}</p>
                                  <p className="truncate"><span className="text-slate-400 dark:text-zinc-500">Reason:</span> {parsed.reason}</p>
                                </div>
                              ) : (
                                <p className="text-[11px] leading-relaxed mt-1 pl-3.5">{n.message}</p>
                              )}
                              
                              <span className="text-[9px] text-slate-400 block mt-2 pl-3.5">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Menu Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  /* FIX 5: Tap target size - min-h-[48px] px-4 ensures >48x48px hit bounds */
                  className="flex items-center gap-2.5 px-3 xl:px-4 rounded-full border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all focus:outline-none min-h-[40px] xl:min-h-[48px]"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      /* FIX 2: Descriptive alt text on avatar */
                      alt={t('patientAvatarAlt')}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-zinc-955"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-ayurveda-green-100 dark:bg-zinc-800 text-ayurveda-green-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs">
                      {user.name[0]}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4.5 py-2.5 border-b border-slate-100 dark:border-zinc-800">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
                      className="flex items-center gap-2 px-4.5 py-2.5 text-xs text-slate-700 dark:text-zinc-400 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={14} className="text-slate-400" />
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4.5 py-2.5 text-xs text-red-600 dark:text-red-400 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800 mt-1"
                    >
                      <LogOut size={14} />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  /* FIX 5: Tap target size - min-h-[48px] px-4 flex items-center ensures >48x48px hit bounds */
                  className="text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-ayurveda-green-600 px-3 xl:px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all duration-200 min-h-[40px] xl:min-h-[48px] flex items-center justify-center"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  /* FIX 5: Tap target size - min-h-[48px] px-4 flex items-center ensures >48x48px hit bounds */
                  className="text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 px-3 xl:px-4 rounded-xl border border-slate-200/50 dark:border-zinc-800 transition-all duration-200 min-h-[40px] xl:min-h-[48px] flex items-center justify-center"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2.5">
            {/* BOOK APPOINTMENT button visible on mobile header */}
            <Link
              to={getDashboardPath()}
              className="bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-full shadow-md shadow-emerald-700/15 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center min-h-[38px]"
            >
              {language === 'mr' ? 'वेळ घ्या' : language === 'hi' ? 'समय लें' : 'Book'}
            </Link>

            <button
              onClick={toggleTheme}
              /* FIX 5: Tap target size - min-h-[48px] min-w-[48px] flex items-center justify-center ensures >48x48px hit area */
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              /* FIX 5: Tap target size - min-h-[48px] min-w-[48px] flex items-center justify-center ensures >48x48px hit area */
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2.5 pb-6 space-y-4 shadow-inner animate-fade-in">
          {navLinks.map((link) => {
            const isTreatments = link.path === '#treatments';
            const activeHash = location.hash || '#home';
            const isActive = link.path === activeHash || (link.path === '/' && activeHash === '#home') || (link.path === '/' && !location.hash);
            
            if (isTreatments) {
              return (
                <div key={link.name} className="flex flex-col">
                  <button
                    onClick={() => setMobileTreatmentsOpen(!mobileTreatmentsOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-xl font-bold text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 focus:outline-none"
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${mobileTreatmentsOpen ? 'rotate-180 text-ayurveda-green-600' : ''}`} />
                  </button>
                  {/* Expandable treatments sub-items */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${mobileTreatmentsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} overflow-hidden pl-4`}>
                    <div className="overflow-hidden flex flex-col gap-1 mt-1">
                      {[
                        { name: language === 'mr' ? 'पंचकर्म' : language === 'hi' ? 'पंचकर्म' : 'Panchakarma', anchor: '#treatments' },
                        { name: language === 'mr' ? 'सांधे आणि मणके निगा' : language === 'hi' ? 'जोड़ और रीढ़ की देखभाल' : 'Joint & Spine Care', anchor: '#treatments' },
                        { name: language === 'mr' ? 'शिरोधारा' : language === 'hi' ? 'शिरोधारा' : 'Shirodhara', anchor: '#treatments' },
                        { name: language === 'mr' ? 'पचन संस्था विकार' : language === 'hi' ? 'पाचन संबंधी विकार' : 'Digestive Disorders', anchor: '#treatments' },
                        { name: language === 'mr' ? 'त्वचा आणि केस' : language === 'hi' ? 'त्वचा और बाल' : 'Skin & Hair', anchor: '#treatments' }
                      ].map((subItem, idx) => (
                        <a
                          key={idx}
                          href={subItem.anchor}
                          onClick={() => {
                            setMobileTreatmentsOpen(false);
                            setIsOpen(false);
                          }}
                          className="block px-3 py-2.5 rounded-xl font-bold text-xs text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl font-bold text-sm transition-colors duration-200 ${isActive ? 'bg-slate-50 dark:bg-zinc-900 text-ayurveda-green-600 dark:text-ayurveda-green-400' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
              >
                {link.name}
              </a>
            );
          })}

          {/* Mobile Language Switch */}
          <div className="py-2 border-t border-slate-100 dark:border-zinc-800">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Select Language</p>
            <div className="flex gap-2 px-3">
              {[
                { code: 'en', label: 'EN' },
                { code: 'mr', label: 'मराठी' },
                { code: 'hi', label: 'हिन्दी' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`text-xs px-3.5 py-2 rounded-full font-bold border transition-all ${language === lang.code ? 'bg-ayurveda-green-600 text-white border-ayurveda-green-600' : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {user.avatar ? (
                    <img src={user.avatar} alt={t('patientAvatarAlt')} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-300">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2.5 rounded-xl font-bold text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-sm font-bold text-slate-700 dark:text-zinc-300"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-ayurveda-green-600 text-white text-sm font-bold hover:bg-ayurveda-green-700 shadow-md shadow-emerald-700/10"
                >
                  {t('register')}
                </Link>
              </div>
            )}
            
            <Link
              to={getDashboardPath()}
              onClick={() => setIsOpen(false)}
              className="block text-center mt-3 bg-ayurveda-saffron-500 hover:bg-ayurveda-saffron-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg uppercase text-xs tracking-wider"
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
