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
  AlertCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings'); // bookings, new-booking, profile
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Clock3 size={10} /> Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-700 dark:text-ayurveda-green-400 border border-emerald-100 dark:border-emerald-900/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} /> Approved
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} /> Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            <XCircle size={10} /> Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Header welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight">
            {t('patientDashTitle')}
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
            {t('welcomeBack')}, <span className="text-ayurveda-green-600 dark:text-ayurveda-green-400">{user?.name}</span>
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'}`}
          >
            <History size={14} />
            <span className="hidden sm:inline">{t('myBookingsTab')}</span>
            <span className="sm:hidden">History</span>
          </button>
          <button
            onClick={() => setActiveTab('new-booking')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'new-booking' ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'}`}
          >
            <FilePlus size={14} />
            <span className="hidden sm:inline">{t('newBookingTab')}</span>
            <span className="sm:hidden">Book</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'}`}
          >
            <User size={14} />
            <span className="hidden sm:inline">{t('editProfileTab')}</span>
            <span className="sm:hidden">Profile</span>
          </button>
        </div>
      </div>

      {/* Tab 1: BOOKING HISTORY */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto">
              <Calendar size={48} className="text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="font-bold text-slate-650 dark:text-zinc-300">{t('noBookings')}</p>
              <button
                onClick={() => setActiveTab('new-booking')}
                className="mt-6 inline-flex items-center gap-2 bg-ayurveda-green-600 hover:bg-ayurveda-green-700 text-white font-bold text-xs uppercase tracking-wider px-6.5 py-3 rounded-full shadow-lg"
              >
                <FilePlus size={14} />
                {t('newBookingTab')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.map((a) => (
                <div
                  key={a._id}
                  className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-800 dark:text-zinc-100 truncate">{a.fullName}</h3>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-0.5">
                          Age: {a.age} | Gender: {a.gender}
                        </p>
                      </div>
                      {getStatusBadge(a.status)}
                    </div>

                    {/* Booking timing and details */}
                    <div className="grid grid-cols-2 gap-4 border-y border-slate-50 dark:border-zinc-800/40 py-3 text-left">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={15} className="text-slate-400 shrink-0" />
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Date</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{new Date(a.preferredDate).toDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={15} className="text-slate-400 shrink-0" />
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Time Slot</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{a.preferredTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left space-y-2">
                      <div>
                        <span className="block text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">{t('diseaseProblem')}</span>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-100/50 dark:border-zinc-850 leading-relaxed font-medium">
                          {a.disease}
                        </p>
                      </div>

                      {/* Doctor remarks */}
                      {a.doctorRemarks && (
                        <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/10 p-3 rounded-2xl text-left">
                          <span className="block text-[9px] text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-wider font-bold mb-0.5">
                            {t('remarksLabel')}
                          </span>
                          <p className="text-xs font-bold text-slate-750 dark:text-zinc-300 leading-normal">
                            {a.doctorRemarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel button */}
                  {['Pending', 'Approved'].includes(a.status) && (
                    <button
                      onClick={() => handleCancelAppointment(a._id)}
                      className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-2xl text-xs font-bold transition-all focus:outline-none"
                    >
                      <Trash2 size={13} />
                      {t('cancelBtn')}
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
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-50">{t('bookTitle')}</h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{t('bookSubtitle')}</p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('fullName')}</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
              />
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
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
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

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('mobileNumber')}</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile number"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
              />
            </div>

            {/* Date & Time Slot Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('prefDate')}</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium text-slate-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('prefTime')}</label>
                <select
                  required
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 dark:text-zinc-300 transition-all"
                >
                  <option value="">{t('selectTime')}</option>
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

            {/* Disease/Problem Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('diseaseProblem')}</label>
              <textarea
                required
                rows="4"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder={t('diseasePlaceholder')}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all resize-none font-medium"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 hover:from-ayurveda-green-750 hover:to-ayurveda-green-800 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all duration-200 uppercase text-xs tracking-wider mt-4 flex items-center justify-center gap-2"
            >
              {bookingLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('loading')}
                </>
              ) : (
                t('btnSubmit')
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: MANAGE PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-50 dark:border-zinc-800 pb-6 mb-6">
            
            {/* Avatar upload display */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-800"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-ayurveda-green-50 dark:bg-zinc-800 text-ayurveda-green-700 dark:text-zinc-200 flex items-center justify-center font-extrabold text-3xl">
                  {user?.name.split(' ')[0][0]}
                </div>
              )}
              
              {/* upload action label */}
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer transition-all border-2 border-white dark:border-zinc-900">
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

            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-50">{t('profilePic')}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Upload a clean JPG, PNG, or WebP photo up to 3MB.</p>
              {uploading && <span className="text-[10px] text-ayurveda-green-600 font-bold block mt-1 animate-pulse">{t('uploading')}</span>}
            </div>

          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('fullName')}</label>
              <input
                type="text"
                required
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('mobileNumber')}</label>
              <input
                type="tel"
                required
                value={profPhone}
                onChange={(e) => setProfPhone(e.target.value)}
                placeholder="Mobile number"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
              />
            </div>

            {/* Age & Gender Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('age')}</label>
                <input
                  type="number"
                  required
                  value={profAge}
                  onChange={(e) => setProfAge(e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 text-left">{t('gender')}</label>
                <select
                  required
                  value={profGender}
                  onChange={(e) => setProfGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 dark:text-zinc-300 transition-all"
                >
                  <option value="">{t('selectGender')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all duration-200 uppercase text-xs tracking-wider mt-4 flex items-center justify-center gap-2"
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
  );
};

export default PatientDashboard;
