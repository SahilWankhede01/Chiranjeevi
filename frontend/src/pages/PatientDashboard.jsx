import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Calendar, 
  History, 
  User, 
  FileText, 
  Clock, 
  Trash2, 
  Upload, 
  CheckCircle, 
  Clock3, 
  XCircle, 
  FilePlus,
  Activity,
  Printer,
  Sparkles,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // bookings, new-booking, quiz, profile
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Booking Form States
  const [fullName, setFullName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [disease, setDisease] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Profile Form States
  const [profName, setProfName] = useState(user?.name || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profAge, setProfAge] = useState(user?.age || '');
  const [profGender, setProfGender] = useState(user?.gender || '');
  const [uploading, setUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Prakriti Quiz States
  const [quizStep, setQuizStep] = useState(0); // 0 = start, 1-5 = questions, 6 = results
  const [quizAnswers, setQuizAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: ''
  });
  const [quizResult, setQuizResult] = useState(null);

  // Print Prescription Slip State
  const [printAppointment, setPrintAppointment] = useState(null);

  // Fetch Patient Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/appointments/my');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to fetch appointments history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update profile inputs when user loads
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setMobileNumber(user.phone);
      setAge(user.age || '');
      setGender(user.gender || '');
      setProfName(user.name);
      setProfPhone(user.phone);
      setProfAge(user.age || '');
      setProfGender(user.gender || '');
    }
  }, [user]);

  // Book Appointment Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !age || !gender || !mobileNumber || !disease || !preferredDate || !preferredTime) {
      showToast(t('fillAll'), 'error');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await axios.post('/api/appointments', {
        fullName,
        age: parseInt(age),
        gender,
        mobileNumber,
        disease,
        preferredDate,
        preferredTime,
      });

      if (res.data.success) {
        showToast(t('bookingSuccess'), 'success');
        setDisease('');
        setPreferredDate('');
        setPreferredTime('');
        fetchAppointments();
        setActiveTab('bookings');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Booking failed.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  // Profile Edit Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profName || !profPhone || !profAge || !profGender) {
      showToast(t('fillAll'), 'error');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({
        name: profName,
        phone: profPhone,
        age: parseInt(profAge),
        gender: profGender,
      });
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Profile update failed.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Avatar Image Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const uploadRes = await axios.post('/api/auth/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (uploadRes.data.success) {
        const imageUrl = uploadRes.data.url;
        await updateProfile({ avatar: imageUrl });
        showToast('Profile image uploaded successfully!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Cancel Appointment Action
  const handleCancelAppointment = async (id) => {
    if (!window.confirm(t('cancelConfirm'))) return;

    try {
      const res = await axios.put(`/api/appointments/${id}/cancel`);
      if (res.data.success) {
        showToast('Appointment cancelled successfully.', 'info');
        fetchAppointments();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Cancellation failed', 'error');
    }
  };

  // Prakriti body type questions
  const quizQuestions = [
    {
      id: 'q1',
      question: 'Body Build / Physical Frame',
      options: [
        { value: 'Vata', label: 'Thin, bony, light build; hard to gain weight.' },
        { value: 'Pitta', label: 'Medium build, muscular, athletic; stable weight.' },
        { value: 'Kapha', label: 'Broad, large build; gains weight easily, slow metabolism.' }
      ]
    },
    {
      id: 'q2',
      question: 'Skin Texture & Sensation',
      options: [
        { value: 'Vata', label: 'Dry, thin, rough, crack-prone; feels cold easily.' },
        { value: 'Pitta', label: 'Oily, warm, reddish tone, easily sunburned, freckles/acne.' },
        { value: 'Kapha', label: 'Smooth, thick, soft, slightly cool/clammy; healthy complexion.' }
      ]
    },
    {
      id: 'q3',
      question: 'Appetite & Digestion style',
      options: [
        { value: 'Vata', label: 'Irregular hunger; frequent bloating, gas, or constipation.' },
        { value: 'Pitta', label: 'Very strong appetite; gets irritable if meals are delayed; acid reflux.' },
        { value: 'Kapha', label: 'Moderate but constant hunger; slow digestion, feels heavy after eating.' }
      ]
    },
    {
      id: 'q4',
      question: 'Sleep Quality',
      options: [
        { value: 'Vata', label: 'Light sleep, wakes up easily, talks/grinds teeth in sleep.' },
        { value: 'Pitta', label: 'Moderate, falls asleep fast but gets hot or has vivid dreams.' },
        { value: 'Kapha', label: 'Deep, heavy, long sleep; difficult to wake up, feels groggy.' }
      ]
    },
    {
      id: 'q5',
      question: 'Stress Reaction & Temperament',
      options: [
        { value: 'Vata', label: 'Quickly gets anxious, worried, or fearful; active mind.' },
        { value: 'Pitta', label: 'Gets angry, competitive, or frustrated under pressure; sharp focus.' },
        { value: 'Kapha', label: 'Calm, patient, steady; dislikes change, avoids confrontation.' }
      ]
    }
  ];

  const handleQuizAnswer = (qKey, val) => {
    setQuizAnswers(prev => ({ ...prev, [qKey]: val }));
    if (quizStep < 5) {
      setQuizStep(prev => prev + 1);
    } else {
      const answersList = Object.values({ ...quizAnswers, [qKey]: val });
      const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
      answersList.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });

      const total = answersList.length;
      const vataPct = Math.round((counts.Vata / total) * 100);
      const pittaPct = Math.round((counts.Pitta / total) * 100);
      const kaphaPct = Math.round((counts.Kapha / total) * 100);

      setQuizResult({ vata: vataPct, pitta: pittaPct, kapha: kaphaPct });
      setQuizStep(6);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    setQuizResult(null);
    setQuizStep(0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Clock3 size={10} /> Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-700 dark:text-ayurveda-green-400 border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} /> Approved
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} /> Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <XCircle size={10} /> Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  const printPrescriptionFlow = (app) => {
    setPrintAppointment(app);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const totalCount = appointments.length;
  const approvedCount = appointments.filter(a => a.status === 'Approved').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 relative">
      
      {/* Background drifting orbs layout layer */}
      <div className="absolute top-20 left-20 w-80 h-80 glow-orb-green -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 glow-orb-saffron -z-10 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* RESPONSIVE SIDEBAR/NAVBAR CONTAINER LAYOUT */}
        <aside className="w-full lg:w-72 glass-panel p-4 lg:p-6 rounded-[1.8rem] lg:rounded-[2.2rem] shadow-xl flex flex-col lg:flex-col gap-4 lg:gap-6 text-left no-print">
          {/* User profile capsule card - Hidden on mobile/tablet to save space */}
          <div className="hidden lg:flex items-center gap-3.5 bg-slate-50/50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-slate-105 dark:border-zinc-800">
            {user?.avatar ? (
              <img src={user.avatar} alt={t('patientAvatarAlt')} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-ayurveda-green-50 dark:bg-zinc-800 text-ayurveda-green-700 dark:text-zinc-200 flex items-center justify-center font-extrabold text-base">
                {user?.name[0]}
              </div>
            )}
            <div className="truncate">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-zinc-100 truncate">{user?.name}</h4>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold truncate block mt-0.5">{user?.email}</span>
            </div>
          </div>

          <div className="hidden lg:block h-[1px] bg-slate-100 dark:bg-zinc-800/80"></div>

          {/* Nav menu links: horizontal scrollable on <lg, vertical on >=lg */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-none py-1 lg:py-0 w-full">
            {[
              { id: 'bookings', label: 'Sessions History', icon: <History size={15} /> },
              { id: 'new-booking', label: 'Book Consultation', icon: <FilePlus size={15} /> },
              { id: 'quiz', label: 'Prakriti Body Quiz', icon: <Activity size={15} /> },
              { id: 'profile', label: 'Manage Profile', icon: <User size={15} /> }
            ].map((menuItem) => (
              <button
                key={menuItem.id}
                onClick={() => setActiveTab(menuItem.id)}
                className={`flex items-center gap-2 lg:gap-3.5 px-4.5 py-3 rounded-xl lg:rounded-2xl text-xs font-bold text-left transition-all whitespace-nowrap min-h-[44px] lg:min-h-[48px] shrink-0 ${
                  activeTab === menuItem.id 
                    ? 'bg-ayurveda-green-500 text-white shadow-lg shadow-emerald-700/10' 
                    : 'text-slate-500 hover:bg-slate-50/50 dark:text-zinc-400 dark:hover:bg-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/35 lg:bg-transparent lg:dark:bg-transparent border border-slate-100 dark:border-zinc-800/40 lg:border-none'
                }`}
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:block h-[1px] bg-slate-100 dark:bg-zinc-800/80 mt-2"></div>

          {/* Quick Metrics - Hidden on mobile/tablet */}
          <div className="hidden lg:block space-y-3 p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10 text-xs font-bold">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Portal Activity</span>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Sessions Total</span>
              <span className="text-slate-800 dark:text-zinc-200">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Approved</span>
              <span className="text-ayurveda-green-700 dark:text-ayurveda-green-400">{approvedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Completed</span>
              <span className="text-blue-600 dark:text-blue-400">{completedCount}</span>
            </div>
          </div>
        </aside>

        {/* WORKSPACE PANEL (Main Content display) */}
        {/* FIX 5: Changed nested <main> to <div role="region"> to ensure only one <main> landmark exists */}
        <div role="region" aria-label="Dashboard Workspace" className="flex-1 w-full glass-panel p-6 sm:p-8 rounded-[2.2rem] shadow-xl no-print text-left min-h-[550px] animate-fade-in">
          
          {/* Tab 1: BOOKING HISTORY */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <History className="text-ayurveda-green-600" size={20} />
                <h2 className="text-xl font-serif font-extrabold text-slate-800 dark:text-zinc-150">Appointment Sessions</h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-16 max-w-md mx-auto space-y-4">
                  <Calendar size={40} className="text-slate-300 dark:text-zinc-750 mx-auto" />
                  <p className="font-extrabold text-slate-600 dark:text-zinc-400">{t('noBookings')}</p>
                  <button
                    onClick={() => setActiveTab('new-booking')}
                    className="bg-ayurveda-green-600 hover:bg-ayurveda-green-750 text-white font-bold text-xs uppercase tracking-wider px-6.5 py-3 rounded-xl shadow-lg"
                  >
                    Create Booking
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((a) => (
                    <div
                      key={a._id}
                      className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5.5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100">{a.fullName}</h3>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                              {a.age}y / {a.gender} | Contact: {a.mobileNumber}
                            </p>
                          </div>
                          {getStatusBadge(a.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-y border-slate-100 dark:border-zinc-800/45 py-3">
                          <div className="flex items-center gap-2.5">
                            <Calendar size={14} className="text-slate-400" />
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Date</span>
                              <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">{new Date(a.preferredDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock size={14} className="text-slate-400" />
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Slot</span>
                              <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">{a.preferredTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-1">Stated Symptoms</span>
                            <p className="text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950/60 p-3 rounded-xl border border-slate-100/50 dark:border-zinc-800 font-semibold leading-relaxed">
                              {a.disease}
                            </p>
                          </div>

                          {/* Vertical Leaf Treatment Timeline */}
                          {a.status !== 'Rejected' && (
                            <div className="p-3 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
                              <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-widest mb-3">Detox Stage</span>
                              
                              <div className="relative pl-6 space-y-4">
                                <div className="absolute top-1 bottom-1 left-[7px] w-[2px] bg-slate-200 dark:bg-zinc-800"></div>

                                {/* Step 1: Purvakarma */}
                                <div className="relative">
                                  <div className={`absolute -left-6 top-[2px] w-4.5 h-4.5 rounded-full flex items-center justify-center border text-[8px] font-extrabold ${['Pending', 'Approved', 'Completed'].includes(a.status) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400 dark:bg-zinc-900'}`}>
                                    {['Approved', 'Completed'].includes(a.status) ? '✓' : '1'}
                                  </div>
                                  <div>
                                    <h5 className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-400">Purvakarma (Preparatory Stages)</h5>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Snehana (Oil massages) & Swedana (steam detoxification).</p>
                                  </div>
                                </div>

                                {/* Step 2: Pradhanakarma */}
                                <div className="relative">
                                  <div className={`absolute -left-6 top-[2px] w-4.5 h-4.5 rounded-full flex items-center justify-center border text-[8px] font-extrabold ${['Approved', 'Completed'].includes(a.status) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400 dark:bg-zinc-900'}`}>
                                    {a.status === 'Completed' ? '✓' : '2'}
                                  </div>
                                  <div>
                                    <h5 className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-355">Pradhanakarma (Main Detox Procedure)</h5>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Basti, Virechana, or Shirodhara execution rules.</p>
                                  </div>
                                </div>

                                {/* Step 3: Paschatkarma */}
                                <div className="relative">
                                  <div className={`absolute -left-6 top-[2px] w-4.5 h-4.5 rounded-full flex items-center justify-center border text-[8px] font-extrabold ${a.status === 'Completed' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    3
                                  </div>
                                  <div>
                                    <h5 className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-355">Paschatkarma (Diet & Rejuvenation)</h5>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Samsarjana Krama (Diet transition) and Rasayana herbs.</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          )}

                          {/* Remarks letterhead slip trigger */}
                          {a.doctorRemarks && (
                            <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/20 p-3.5 rounded-2xl relative overflow-hidden">
                              <span className="block text-[8px] text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-widest font-extrabold mb-1.5">Doctor Prescription Memo</span>
                              <p className="text-xs font-bold text-slate-750 dark:text-zinc-200 leading-normal border-l border-emerald-500 pl-2.5">
                                {a.doctorRemarks}
                              </p>
                              
                              <button
                                onClick={() => printPrescriptionFlow(a)}
                                className="mt-3.5 inline-flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-3 py-1.5 rounded-xl text-[9px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Printer size={10} />
                                Print Slip
                              </button>
                            </div>
                          )}

                        </div>
                      </div>

                      {['Pending', 'Approved'].includes(a.status) && (
                        <button
                          onClick={() => handleCancelAppointment(a._id)}
                          className="mt-5 w-full py-2.5 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 hover:bg-red-50/50 rounded-xl text-xs font-bold transition-all"
                        >
                          Cancel Booking Request
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Tab 2: BOOK NEW APPOINTMENT */}
          {activeTab === 'new-booking' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <FilePlus className="text-ayurveda-green-600" size={20} />
                <h2 className="text-xl font-serif font-extrabold text-slate-800 dark:text-zinc-150">Book New Session</h2>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                             {/* Full Name */}
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                  />
                </div>

                {/* Age & Visual Gender pills selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Age</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="30"
                      className="w-full h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                    />
                  </div>

                  {/* Gender Chips */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Gender</label>
                    <div className="flex gap-2">
                      {['Male', 'Female', 'Other'].map((gOpt) => (
                        <button
                          key={gOpt}
                          type="button"
                          onClick={() => setGender(gOpt)}
                          className={`flex-1 h-[48px] flex items-center justify-center px-3 rounded-xl border text-xs font-bold text-center transition-all ${gender === gOpt ? 'bg-ayurveda-green-600 border-ayurveda-green-600 text-white' : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400'}`}
                        >
                          {gOpt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-555 uppercase tracking-widest mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                  />
                </div>

                {/* Date & Time slots dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Preferred Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold text-slate-550"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Time Slot</label>
                    <select
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-[48px] px-4 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-300 transition-all font-semibold"
                    >
                      <option value="">Select Time</option>
                      <optgroup label="Morning (10:00 AM - 02:00 PM)">
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                      </optgroup>
                      <optgroup label="Evening (05:00 PM - 09:00 PM)">
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Disease */}
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Symptoms / Health Issue</label>
                  <textarea
                    required
                    rows="4"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    placeholder="Describe symptoms, duration, or previous checkups..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all resize-none font-semibold"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 text-white font-extrabold min-h-[48px] py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300 uppercase text-xs tracking-widest flex items-center justify-center gap-2.5"
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Confirm Appointment</span>
                  )}
                </button>

              </form>
            </div>
          )}

          {/* Tab 3: PRAKRITI (DOSHA) QUIZ */}
          {activeTab === 'quiz' && (
            <div className="max-w-xl mx-auto space-y-6">
              
              {quizStep === 0 && (
                <div className="text-center space-y-6 py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-ayurveda-green-650 dark:text-ayurveda-green-400 flex items-center justify-center mx-auto float-animation">
                    <Activity size={32} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-extrabold text-slate-800 dark:text-zinc-100">Ayurvedic Prakriti Diagnostic Quiz</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Discover your custom constitutional body type (Vata, Pitta, Kapha) based on daily physical traits, digestive comfort, sleep cycles, and temperament.
                    </p>
                  </div>
                  <button
                    onClick={() => setQuizStep(1)}
                    className="bg-ayurveda-green-650 hover:bg-ayurveda-green-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg"
                  >
                    Start Diagnostic Quiz
                  </button>
                </div>
              )}

              {quizStep >= 1 && quizStep <= 5 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Question {quizStep} of 5</span>
                    <span>{Math.round(((quizStep - 1) / 5) * 100)}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-ayurveda-green-600 h-full transition-all" style={{ width: `${(quizStep / 5) * 100}%` }}></div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-slate-850 dark:text-zinc-100">
                      {quizQuestions[quizStep - 1].question}
                    </h3>
                    <div className="space-y-3">
                      {quizQuestions[quizStep - 1].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(`q${quizStep}`, opt.value)}
                          className="w-full text-left p-4.5 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-950 flex items-center justify-between group transition-all"
                        >
                          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-400">{opt.label}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 translate-x-0 group-hover:translate-x-1 duration-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {quizStep === 6 && quizResult && (
                <div className="space-y-8 py-2">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-ayurveda-green-600">
                      <span>Body Diagnostic Calculations</span>
                    </div>
                    <h2 className="text-2xl font-serif font-extrabold text-slate-850 dark:text-zinc-150">Your Dosha Constitution</h2>
                  </div>

                  {/* Level dial stats */}
                  <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-950/30 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                    
                    {/* Vata */}
                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <div className="flex justify-between">
                        <span>🍃 Vata (Air/Space)</span>
                        <span>{quizResult.vata}%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${quizResult.vata}%` }}></div>
                      </div>
                    </div>

                    {/* Pitta */}
                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <div className="flex justify-between">
                        <span>🔥 Pitta (Fire/Water)</span>
                        <span>{quizResult.pitta}%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${quizResult.pitta}%` }}></div>
                      </div>
                    </div>

                    {/* Kapha */}
                    <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <div className="flex justify-between">
                        <span>🌱 Kapha (Earth/Water)</span>
                        <span>{quizResult.kapha}%</span>
                      </div>
                      <div className="w-full bg-slate-200/50 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${quizResult.kapha}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-2">Diet & Routine Advice</h4>
                    
                    {quizResult.vata >= quizResult.pitta && quizResult.vata >= quizResult.kapha && (
                      <div className="space-y-2 pl-3.5 border-l-2 border-sky-400">
                        <p className="font-bold text-slate-700 dark:text-zinc-300">Vata Dominant Advice:</p>
                        <p>Focus on warm, fully cooked, and grounding foods. Incorporate healthy fats like warm ghee or sesame oil. Avoid raw salads, cold drinks, and dry snacks. Maintain structured warm morning sleep schedules and oil massages (Abhyanga).</p>
                      </div>
                    )}

                    {quizResult.pitta >= quizResult.vata && quizResult.pitta >= quizResult.kapha && (
                      <div className="space-y-2 pl-3.5 border-l-2 border-amber-400">
                        <p className="font-bold text-slate-700 dark:text-zinc-300">Pitta Dominant Advice:</p>
                        <p>Focus on cooling, hydrating foods. Drink fresh coconut water and eat sweet/bitter vegetables. Avoid hot, spicy, sour, fried, and salty items. Protect your skin from excessive direct sunlight and avoid high-stress projects.</p>
                      </div>
                    )}

                    {quizResult.kapha >= quizResult.vata && quizResult.kapha >= quizResult.pitta && (
                      <div className="space-y-2 pl-3.5 border-l-2 border-emerald-500">
                        <p className="font-bold text-slate-700 dark:text-zinc-300">Kapha Dominant Advice:</p>
                        <p>Focus on light, warm, dry, and spicy foods. Eat green leafy vegetables, hot ginger tea, and limit dairy, ice cream, sweets, and heavy fats. Practice active daily cardiorespiratory workouts and avoid napping in the daytime.</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetQuiz}
                      className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider text-center"
                    >
                      Retake Diagnostic Quiz
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 4: MANAGE PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-ayurveda-green-600" size={20} />
                <h2 className="text-xl font-serif font-extrabold text-slate-800 dark:text-zinc-150">Manage Profile Details</h2>
              </div>

              <div className="flex items-center gap-6 border-b border-slate-100 dark:border-zinc-800 pb-6">
                <div className="relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={t('patientAvatarAlt')} className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-800" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-ayurveda-green-50 dark:bg-zinc-800 text-ayurveda-green-700 dark:text-zinc-400 flex items-center justify-center font-extrabold text-2xl">
                      {user?.name[0]}
                    </div>
                  )}
                  
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white dark:border-zinc-900">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100">{t('profilePic')}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Upload JPG, PNG, or WebP up to 3MB.</p>
                  {uploading && <span className="text-[10px] text-ayurveda-green-600 font-bold block mt-1 animate-pulse">{t('uploading')}</span>}
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="text-left">
                  <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">{t('fullName')}</label>
                  <input
                    type="text"
                    required
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                  />
                </div>

                <div className="text-left">
                  <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-555 uppercase tracking-widest mb-1.5">{t('mobileNumber')}</label>
                  <input
                    type="tel"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">{t('age')}</label>
                    <input
                      type="number"
                      required
                      value={profAge}
                      onChange={(e) => setProfAge(e.target.value)}
                      placeholder="30"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-semibold"
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest mb-1.5">{t('gender')}</label>
                    <select
                      required
                      value={profGender}
                      onChange={(e) => setProfGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-300 transition-all font-semibold"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">{t('male')}</option>
                      <option value="Female">{t('female')}</option>
                      <option value="Other">{t('other')}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full bg-slate-805 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all uppercase text-xs tracking-wider mt-4 flex items-center justify-center gap-2"
                >
                  {profileLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('loading')}
                    </>
                  ) : (
                    t('saveChanges')
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* 4. PRINT-ONLY CLINICAL MEMO PRESCRIPTION */}
      {printAppointment && (
        <div className="print-only hidden print-container text-black font-sans text-left p-10 bg-white">
          <div className="border-b-4 border-emerald-800 pb-5 mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-wide uppercase text-emerald-800">SHREE CHIRANJEEVI</h1>
            <p className="text-xs uppercase font-extrabold text-amber-600 tracking-[0.2em] mt-1">Ayurveda & Panchakarma Clinic</p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">In front of Dr. Pravin Chaudhary Hospital, Pandhurna Chauk, Warud, Dist. Amravati, Maharashtra 444906 | Contact: +91 9145331731</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <p><span className="text-slate-400">Patient Name:</span> <strong className="text-black text-sm">{printAppointment.fullName}</strong></p>
              <p className="mt-1"><span className="text-slate-400">Age / Gender:</span> {printAppointment.age} Y / {printAppointment.gender}</p>
              <p className="mt-1"><span className="text-slate-400">Contact Number:</span> {printAppointment.mobileNumber}</p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-400">Prescription Date:</span> {new Date(printAppointment.preferredDate).toLocaleDateString()}</p>
              <p className="mt-1"><span className="text-slate-400">Time Slot:</span> {printAppointment.preferredTime}</p>
              <p className="mt-1"><span className="text-slate-400">App ID:</span> #{printAppointment._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          <div className="border-t border-b border-slate-200 py-4 mb-6">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Diagnosed Symptoms / Issues:</span>
            <p className="text-xs italic leading-relaxed text-slate-800 pl-3 border-l-2 border-emerald-600 font-semibold">{printAppointment.disease}</p>
          </div>

          <div className="mb-10">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">Clinical Prescription & Treatment Advice:</span>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs leading-relaxed font-bold whitespace-pre-line text-black">
              {printAppointment.doctorRemarks || 'No formal medicines written. Follow standard dietary advice.'}
            </div>
          </div>

          <div className="flex justify-between items-end pt-16 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 italic">This is a system-generated prescription slip.</p>
            </div>
            <div className="text-center w-40">
              <div className="h-[2px] bg-black w-full mb-2"></div>
              <p className="text-[10px] font-extrabold uppercase text-slate-800">Dr. Yatesh Gahukar</p>
              <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wide mt-0.5">B.A.M.S., MD (Ayu)</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
