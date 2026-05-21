import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-ayurveda-saffron-100 dark:bg-orange-950/20 text-ayurveda-saffron-500 flex items-center justify-center mb-6 animate-pulse">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-800 dark:text-zinc-50">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-zinc-200 mt-2">Page Not Found</h2>
      <p className="text-slate-400 dark:text-zinc-500 text-xs mt-3 max-w-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 bg-ayurveda-green-600 hover:bg-ayurveda-green-700 text-white font-bold text-xs uppercase tracking-wider px-6.5 py-3.5 rounded-full shadow-lg transition-all"
      >
        <Home size={14} />
        {t('home')}
      </Link>
    </div>
  );
};

export default NotFound;
