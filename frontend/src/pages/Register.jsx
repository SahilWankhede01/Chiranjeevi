import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('patient');
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
    if (!name || !email || !password || !phone || !age || !gender) {
      showToast(t('fillAll'), 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoadingState(true);
    try {
      const regUser = await register({
        name,
        email,
        password,
        phone,
        age: parseInt(age),
        gender,
        role,
      });

      showToast(`Account registered successfully. Welcome, ${regUser.name}!`, 'success');
      
      if (regUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800/80">
        
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-ayurveda-green-600 to-ayurveda-saffron-500 flex items-center justify-center text-white shadow-md">
            <UserPlus size={24} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-800 dark:text-zinc-50">
            {t('register')}
          </h2>
          <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500 font-medium">
            Create an account to book and manage appointments
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Email */}
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
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••• (Min. 6 chars)"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9145331731"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Age & Gender Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('age')}</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('gender')}</label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 dark:text-zinc-300 transition-all"
              >
                <option value="">{t('selectGender')}</option>
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
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
              t('register')
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center text-xs mt-6 text-slate-500 dark:text-zinc-500">
          <span>Already registered? </span>
          <Link
            to="/login"
            className="font-bold text-ayurveda-green-600 dark:text-ayurveda-green-400 hover:underline"
          >
            {t('login')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
