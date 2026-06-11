import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

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
    <div className="min-h-[85vh] flex items-stretch bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
      
      {/* DESKTOP SPLIT PANEL (Left Side visual) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#0f2e1e] to-[#205136] text-white p-12 flex-col justify-between relative overflow-hidden text-left">
        
        {/* Floating background blur orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 glow-orb-green opacity-40"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 glow-orb-saffron opacity-20"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-1 bg-white/10 rounded-xl">
            <Sparkles size={20} className="text-emerald-350" />
          </div>
          <div>
            <span className="font-serif font-extrabold text-lg tracking-wide uppercase">SHREE CHIRANJEEVI</span>
            <span className="block text-[8px] tracking-widest text-emerald-300 font-extrabold uppercase mt-0.5">Ayurveda & Panchakarma Clinic</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <h2 className="text-4xl font-serif leading-snug tracking-tight font-medium">
            "Health is a state of complete harmony of <span className="italic text-emerald-300">body, mind, and spirit.</span>"
          </h2>
          <p className="text-xs text-emerald-100/70 font-semibold leading-relaxed">
            Connect to your patient account to book authentic Panchakarma therapies, view personalized herbal routines, and manage checkups under Dr. Yatesh Gahukar.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-emerald-250 font-bold uppercase tracking-wider">
          © Shree Chiranjeevi Clinic • Authentic Healing
        </div>

      </div>

      {/* CARD CONSOLE (Right Side form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative">
        <div className="absolute top-10 right-10 w-72 h-72 glow-orb-saffron -z-10 opacity-30"></div>
        
        <div className="max-w-md w-full space-y-8 glass-card-premium p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-left">
          
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-ayurveda-green-600 to-ayurveda-green-700 flex items-center justify-center text-white shadow-lg float-animation">
              <LogIn size={22} className="stroke-[2.2]" />
            </div>
            <h2 className="mt-5 text-2xl font-serif font-extrabold text-slate-805 dark:text-zinc-50 tracking-tight">
              {t('login')}
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
              Access your clinical portal
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-555 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none min-h-[48px]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingState}
              className="w-full bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 text-white font-extrabold min-h-[48px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase text-xs tracking-widest mt-6 flex items-center justify-center gap-2.5"
            >
              {loadingState ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>{t('login')}</span>
              )}
            </button>
          </form>

          <div className="text-center text-xs mt-6 text-slate-400 dark:text-zinc-400 font-bold">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-ayurveda-green-600 hover:underline font-extrabold">
              {t('register')}
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
