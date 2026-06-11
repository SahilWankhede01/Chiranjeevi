import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Phone, UserPlus, Sparkles } from 'lucide-react';

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

  // Email validation states
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState('');
  const [emailValidationSuccess, setEmailValidationSuccess] = useState('');
  const [apiConflictError, setApiConflictError] = useState(false);
  const debounceRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const disposableBlacklist = [
    'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'throwaway.email',
    'fakeinbox.com', 'yopmail.com', 'sharklasers.com', 'trashmail.com',
    'maildrop.cc', 'dispostable.com', 'temp-mail.org', 'getnada.com'
  ];

  const performValidation = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailChecking(false);
      setEmailValidationError('');
      setEmailValidationSuccess('');
      return false;
    }

    if (!emailRegex.test(trimmed)) {
      setEmailValidationError(t('emailValidFormatErr'));
      setEmailValidationSuccess('');
      setEmailChecking(false);
      return false;
    }

    const domain = trimmed.split('@')[1];
    if (domain && disposableBlacklist.includes(domain.toLowerCase())) {
      setEmailValidationError(t('emailDisposableErr'));
      setEmailValidationSuccess('');
      setEmailChecking(false);
      return false;
    }

    setEmailValidationSuccess(t('emailValidSuccess'));
    setEmailValidationError('');
    setEmailChecking(false);
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setEmail(val);
    
    // Clear validation and duplicate error states immediately as the user types
    setEmailValidationError('');
    setEmailValidationSuccess('');
    setApiConflictError(false);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val) {
      setEmailChecking(true);
      debounceRef.current = setTimeout(() => {
        performValidation(val);
      }, 505);
    } else {
      setEmailChecking(false);
    }
  };

  const handleEmailBlur = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    performValidation(email);
  };

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

    // Final verification of validation state before submit
    const isValid = performValidation(email);
    if (!isValid) {
      return;
    }

    setLoadingState(true);
    setApiConflictError(false);
    try {
      const regUser = await register({
        name,
        email: email.trim(),
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
      const isConflict = err.response?.status === 409;
      if (isConflict) {
        setApiConflictError(true);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
        showToast(errorMsg, 'error');
      }
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
            "Prevent chronic disorders, restore your <span className="italic text-emerald-300">natural vitality.</span>"
          </h2>
          <p className="text-xs text-emerald-100/70 font-semibold leading-relaxed">
            Create your patient profile to begin clinical consultations, schedule detox therapy appointments, calculate your Prakriti dosha score, and message Dr. Yatesh Gahukar.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-emerald-250 font-bold uppercase tracking-wider">
          © Shree Chiranjeevi Clinic • Authentic Healing
        </div>

      </div>

      {/* CARD CONSOLE (Right Side form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative overflow-y-auto max-h-[85vh]">
        <div className="absolute top-10 right-10 w-72 h-72 glow-orb-saffron -z-10 opacity-30"></div>
        
        <div className="max-w-md w-full space-y-8 glass-card-premium p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-left">
          
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-ayurveda-green-600 to-ayurveda-green-700 flex items-center justify-center text-white shadow-lg float-animation">
              <UserPlus size={22} className="stroke-[2.2]" />
            </div>
            <h2 className="mt-5 text-2xl font-serif font-extrabold text-slate-805 dark:text-zinc-50 tracking-tight">
              {t('register')}
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
              Join the clinic today
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            
            {/* Name */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="john@example.com"
                  className={`w-full pl-11 pr-4 rounded-2xl border text-xs focus:ring-2 focus:outline-none transition-all font-semibold h-[48px] dark:bg-zinc-955 ${
                    !email
                      ? 'border-slate-200 dark:border-zinc-800 focus:ring-ayurveda-green-500 dark:text-zinc-100'
                      : emailChecking
                      ? 'border-ayurveda-saffron-400 dark:border-ayurveda-saffron-600 focus:ring-ayurveda-saffron-500 dark:text-zinc-100'
                      : emailValidationError
                      ? 'border-red-500 dark:border-red-800 focus:ring-red-500 text-red-650 dark:text-red-400'
                      : emailValidationSuccess
                      ? 'border-emerald-500 dark:border-emerald-700 focus:ring-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-zinc-800 focus:ring-ayurveda-green-500 dark:text-zinc-100'
                  }`}
                />
              </div>
              
              {/* Email validation feedback message */}
              <div aria-live="polite" className="mt-1.5 text-[11px] font-bold min-h-[16px] flex items-center">
                {emailChecking && (
                  <div className="flex items-center gap-1.5 text-ayurveda-saffron-600 dark:text-ayurveda-saffron-400">
                    <div className="w-3.5 h-3.5 border-2 border-ayurveda-saffron-600 dark:border-ayurveda-saffron-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('emailChecking')}</span>
                  </div>
                )}
                {!emailChecking && emailValidationError && (
                  <span className="text-red-600 dark:text-red-400">{emailValidationError}</span>
                )}
                {!emailChecking && emailValidationSuccess && (
                  <span className="text-emerald-600 dark:text-emerald-400">{emailValidationSuccess}</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••• (Min. 6 chars)"
                  className="w-full pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9145331731"
                  className="w-full pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
              </div>
            </div>

            {/* Register As Role */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Register As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-150 transition-all font-semibold h-[48px]"
              >
                <option value="patient">Patient / Customer</option>
                <option value="doctor">Doctor Admin (Authorized email)</option>
              </select>
            </div>

            {/* Age & Gender Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{t('age')}</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  className="w-full px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold h-[48px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{t('gender')}</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-300 transition-all font-semibold h-[48px]"
                >
                  <option value="">{t('selectGender')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
            </div>

            {/* 409 Conflict Error Box */}
            {apiConflictError && (
              <div
                className="flex flex-col gap-2 p-4 rounded-xl border-l-4 border-red-500 bg-white dark:bg-zinc-900 shadow-md text-left mt-4 mb-2"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-sm leading-none mt-0.5">⚠️</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    {t('emailDuplicateErr')}
                  </span>
                </div>
                <div className="pl-6">
                  <Link
                    to="/login"
                    className="text-[11px] font-extrabold text-ayurveda-green-600 hover:text-ayurveda-green-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors uppercase tracking-wider"
                  >
                    {t('alreadyHaveAccountLogin')}
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingState || emailChecking || !!emailValidationError || !emailValidationSuccess || !email}
              className="w-full bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 text-white font-extrabold min-h-[48px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase text-xs tracking-widest mt-6 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingState ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>{t('register')}</span>
              )}
            </button>
          </form>

          <div className="text-center text-xs mt-6 text-slate-400 dark:text-zinc-500 font-bold">
            <span>Already registered? </span>
            <Link to="/login" className="text-ayurveda-green-605 hover:underline font-extrabold">
              {t('login')}
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;
