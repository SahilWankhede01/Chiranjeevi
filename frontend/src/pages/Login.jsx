import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast(t('fillAll'), 'error');
      return;
    }

    setLoadingState(true);
    try {
      const loggedUser = await login(email, password);
      showToast(t('welcomeBack') + `, ${loggedUser.name}!`, 'success');
      if (loggedUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-[#faf7e6] to-[#faf7e6]/95 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800/80">
        
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-ayurveda-green-600 to-ayurveda-saffron-500 flex items-center justify-center text-white shadow-md">
            <LogIn size={24} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-800 dark:text-zinc-50">
            {t('login')}
          </h2>
          <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
            Access your clinic account and appointments
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Email field */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            disabled={loadingState}
            className="w-full bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 hover:from-ayurveda-green-750 hover:to-ayurveda-green-800 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all duration-200 uppercase text-xs tracking-wider mt-4 flex items-center justify-center gap-2"
          >
            {loadingState ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('loading')}
              </>
            ) : (
              t('login')
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center text-xs mt-6 text-slate-500 dark:text-zinc-500">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="font-bold text-ayurveda-green-600 dark:text-ayurveda-green-400 hover:underline"
          >
            {t('register')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
