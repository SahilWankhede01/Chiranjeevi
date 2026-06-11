import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import MobileTable from '../components/MobileTable';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  Check,
  X,
  FileText,
  User,
  Bell,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Eye,
  LayoutDashboard
} from 'lucide-react';

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

const DoctorDashboard = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { notifications, fetchNotifications, markNotificationAsRead } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('bookings'); // bookings, calendar, notifications
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]); // used for calendar mapping
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Doctor remarks draft state per appointment
  const [remarksDrafts, setRemarksDrafts] = useState({});

  // Active slot display detail for calendar view
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  // Fetch dashboard stats
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/appointments/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all appointments for calendar display
  const fetchAllAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments/doctor?limit=200');
      if (res.data.success) {
        setAllAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch appointments list
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 8,
        status: statusFilter,
      });

      if (search) queryParams.append('search', search);
      if (dateFilter) queryParams.append('date', dateFilter);

      const res = await axios.get(`/api/appointments/doctor?${queryParams.toString()}`);
      if (res.data.success) {
        setAppointments(res.data.data);
        setTotalPages(res.data.pages);
        setTotalRecords(res.data.total);

        const drafts = {};
        res.data.data.forEach((app) => {
          drafts[app._id] = app.doctorRemarks || '';
        });
        setRemarksDrafts(drafts);
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchNotifications();
    fetchAllAppointments();
  }, []);

  // Fetch when pagination, search, status, or date filters change
  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAppointments();
  };

  const clearFilters = () => {
    setSearch('');
    setDateFilter('');
    setStatusFilter('All');
    setPage(1);
  };

  const handleRemarksChange = (id, val) => {
    setRemarksDrafts((prev) => ({ ...prev, [id]: val }));
  };

  const handleStatusUpdate = async (id, status) => {
    const remarks = remarksDrafts[id] || '';
    setActionLoadingId(id);

    try {
      const res = await axios.put(`/api/appointments/${id}/status`, {
        status,
        doctorRemarks: remarks,
      });

      if (res.data.success) {
        showToast(`Appointment status updated to: ${status}`, 'success');
        fetchAnalytics();
        fetchAppointments();
        fetchNotifications();
        fetchAllAppointments();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Status update failed.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-[10px] font-bold bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-405 border border-yellow-100 dark:border-yellow-900/30 rounded-full uppercase tracking-wider">Pending</span>;
      case 'Approved':
        return <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-700 dark:text-ayurveda-green-400 border border-emerald-100 dark:border-emerald-900/30 rounded-full uppercase tracking-wider">Approved</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full uppercase tracking-wider">Completed</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 text-[10px] font-bold bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return status;
    }
  };

  const getCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const calendarDays = getCalendarDays();

  const findAppointmentBySlot = (day, slot) => {
    return allAppointments.find((app) => {
      const appDate = new Date(app.preferredDate);
      return appDate.toDateString() === day.toDateString() && app.preferredTime === slot;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 relative">
      
      {/* Drifting glow elements */}
      <div className="absolute top-20 left-20 w-80 h-80 glow-orb-green -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 glow-orb-saffron -z-10 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* RESPONSIVE DOCTOR SIDEBAR LAYOUT */}
        <aside className="w-full lg:w-72 glass-panel p-4 lg:p-6 rounded-[1.8rem] lg:rounded-[2.2rem] shadow-xl flex flex-col lg:flex-col gap-4 lg:gap-6 text-left no-print">
          
          {/* Doctor Info Capsule - Hidden on mobile/tablet to save space */}
          <div className="hidden lg:flex items-center gap-3.5 bg-slate-50/50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-zinc-800 text-ayurveda-green-700 dark:text-zinc-200 flex items-center justify-center font-extrabold text-base border-2 border-emerald-500">
              DG
            </div>
            <div className="truncate">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-zinc-100 truncate">Dr. Y. Gahukar</h4>
              <span className="text-[9px] text-slate-400 dark:text-zinc-400 font-extrabold tracking-wider uppercase block mt-0.5">B.A.M.S., MD (Ayu)</span>
            </div>
          </div>

          <div className="hidden lg:block h-[1px] bg-slate-100 dark:bg-zinc-800/80"></div>

          {/* Nav Links: horizontal scrollable on <lg, vertical on >=lg */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-none py-1 lg:py-0 w-full">
            {[
              { id: 'bookings', label: 'Dashboard Queue', icon: <LayoutDashboard size={15} /> },
              { id: 'calendar', label: 'Interactive Scheduler', icon: <Calendar size={15} /> },
              { id: 'notifications', label: 'System Logs', icon: <Bell size={15} /> }
            ].map((menuItem) => (
              <button
                key={menuItem.id}
                onClick={() => setActiveSubTab(menuItem.id)}
                className={`flex items-center gap-2 lg:gap-3.5 px-4.5 py-3 rounded-xl lg:rounded-2xl text-xs font-bold text-left transition-all whitespace-nowrap min-h-[44px] lg:min-h-[48px] shrink-0 ${
                  activeSubTab === menuItem.id 
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

          {/* Quick Stats list - Hidden on mobile/tablet */}
          {analytics && (
            <div className="hidden lg:block space-y-3 p-3 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/10 text-xs font-bold">
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Status Metrics</span>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Total Booked</span>
                <span className="text-slate-800 dark:text-zinc-200">{analytics.totalAppointments}</span>
              </div>
              <div className="flex justify-between animate-pulse">
                <span className="text-yellow-605 font-semibold">Pending Queue</span>
                <span className="text-yellow-600 dark:text-yellow-500">{analytics.pendingAppointments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Approved</span>
                <span className="text-ayurveda-green-700 dark:text-ayurveda-green-400">{analytics.approvedAppointments}</span>
              </div>
            </div>
          )}

        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        {/* FIX 5: Changed nested <main> to <div role="region"> to ensure only one <main> landmark exists */}
        <div role="region" aria-label="Doctor Workspace" className="flex-1 w-full glass-panel p-6 sm:p-8 rounded-[2.2rem] shadow-xl no-print text-left min-h-[550px] animate-fade-in">
          
          {/* Subtab 1: bookings queue */}
          {activeSubTab === 'bookings' && (
            <div className="space-y-6">
              
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="text-ayurveda-green-650" size={20} />
                <h2 className="text-xl font-serif font-extrabold text-slate-800 dark:text-zinc-150">Clinic Appointments Queue</h2>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-slate-105 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex items-center relative">
                  <input
                    type="text"
                    placeholder="Search Patient Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 md:py-2 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-ayurveda-green-500 dark:text-zinc-200 min-h-[44px] md:min-h-0"
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={14} />
                  </span>
                </form>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs font-bold w-full md:w-auto">
                  <div className="flex flex-1 sm:flex-initial items-center gap-2">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider whitespace-nowrap">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                      className="w-full sm:w-auto px-3 py-2.5 md:py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:outline-none dark:text-zinc-300 min-h-[44px] md:min-h-0"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex flex-1 sm:flex-initial items-center gap-2">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider whitespace-nowrap">Date:</span>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                      className="w-full sm:w-auto px-3 py-2.5 md:py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-ayurveda-green-500 min-h-[44px] md:min-h-0"
                    />
                  </div>

                  {(search || dateFilter || statusFilter !== 'All') && (
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:underline min-h-[44px] sm:min-h-0 px-2">Clear</button>
                  )}
                </div>
              </div>

              {/* Table */}
              {/* Mobile Table */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar size={36} className="text-slate-300 mx-auto mb-2" />
                    <p className="font-extrabold text-slate-550 dark:text-zinc-400">No appointments found matching filters.</p>
                  </div>
                ) : (
                  <MobileTable
                    headers={[
                      'Patient',
                      'Schedule',
                      'Symptoms',
                      'Status',
                      'Remarks / Advice',
                      { label: 'Actions', align: 'right' }
                    ]}
                    data={appointments}
                    renderMobileCard={(a) => (
                      <div className="space-y-3 text-left">
                        {/* Card Header: Patient details */}
                        <div className="flex items-center gap-3">
                          {a.patient?.avatar ? (
                            <img src={a.patient.avatar} alt={t('patientAvatarAlt')} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-800" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-500">
                              <User size={15} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-808 dark:text-zinc-100 text-sm truncate">{a.fullName}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{a.age}y / {a.gender} | Contact: {a.mobileNumber}</p>
                          </div>
                          <div>
                            {getStatusBadge(a.status)}
                          </div>
                        </div>

                        <div className="h-[1px] bg-slate-100 dark:bg-zinc-800/80"></div>

                        {/* Schedule & Symptoms details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Schedule</span>
                            <span className="font-bold text-slate-850 dark:text-zinc-200">{new Date(a.preferredDate).toLocaleDateString()}</span>
                            <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{a.preferredTime}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Symptoms</span>
                            <p className="font-semibold text-slate-605 dark:text-zinc-400 truncate" title={a.disease}>{a.disease}</p>
                          </div>
                        </div>

                        {/* Prescriptions input */}
                        <div className="space-y-1">
                          <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Remarks / Advice</span>
                          <input
                            type="text"
                            value={remarksDrafts[a._id] || ''}
                            onChange={(e) => handleRemarksChange(a._id, e.target.value)}
                            placeholder="Enter prescriptions..."
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-1 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-200 font-semibold min-h-[44px]"
                          />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                          {actionLoadingId === a._id ? (
                            <div className="w-5 h-5 border-2 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
                          ) : (
                            <div className="flex items-center gap-2 w-full justify-between">
                              <span className="text-[10px] text-slate-400 font-bold">Actions:</span>
                              <div className="flex items-center gap-2">
                                {a.status === 'Pending' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Approved')}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-green-400 transition-colors font-bold text-xs min-h-[44px]"
                                  >
                                    <Check size={14} className="stroke-[3]" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {a.status === 'Approved' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Completed')}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-150 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 transition-colors font-bold text-xs min-h-[44px]"
                                  >
                                    <CheckCircle size={14} />
                                    <span>Complete</span>
                                  </button>
                                )}

                                {['Pending', 'Approved'].includes(a.status) && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Rejected')}
                                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400 transition-colors font-bold text-xs min-h-[44px]"
                                  >
                                    <X size={14} className="stroke-[3]" />
                                    <span>Cancel</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    renderRow={(a) => (
                      <tr key={a._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-all">
                        
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            {a.patient?.avatar ? (
                              <img src={a.patient.avatar} alt={t('patientAvatarAlt')} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 dark:border-zinc-800" />
                            ) : (
                              <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-500">
                                <User size={13} />
                              </div>
                            )}
                            <div>
                              <p className="font-extrabold text-slate-800 dark:text-zinc-100 leading-normal">{a.fullName}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{a.age}y / {a.gender} | Contact: {a.mobileNumber}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-800 dark:text-zinc-200">
                          <p>{new Date(a.preferredDate).toLocaleDateString()}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{a.preferredTime}</p>
                        </td>

                        <td className="px-5 py-4 max-w-[150px]">
                          <p className="truncate font-semibold text-slate-600 dark:text-zinc-400" title={a.disease}>{a.disease}</p>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {getStatusBadge(a.status)}
                        </td>

                        <td className="px-5 py-4 min-w-[200px]">
                          <input
                            type="text"
                            value={remarksDrafts[a._id] || ''}
                            onChange={(e) => handleRemarksChange(a._id, e.target.value)}
                            placeholder="Enter prescriptions..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-1 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-200 font-semibold"
                          />
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {actionLoadingId === a._id ? (
                              <div className="w-4.5 h-4.5 border-2 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
                            ) : (
                              <>
                                {a.status === 'Pending' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Approved')}
                                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-green-400 transition-colors"
                                  >
                                    <Check size={13} className="stroke-[3]" />
                                  </button>
                                )}

                                {a.status === 'Approved' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Completed')}
                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-150 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400 transition-colors"
                                  >
                                    <CheckCircle size={13} />
                                  </button>
                                )}

                                {['Pending', 'Approved'].includes(a.status) && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Rejected')}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-400 transition-colors"
                                  >
                                    <X size={13} className="stroke-[3]" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    )}
                  />
                )}

                {totalPages > 1 && (
                  <div className="bg-slate-50/50 dark:bg-zinc-950/20 px-5 py-3.5 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Showing {appointments.length} of {totalRecords} records</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="p-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg disabled:opacity-40"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-400">Page {page} of {totalPages}</span>
                      <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="p-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg disabled:opacity-40"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Subtab 2: weekly scheduler */}
          {activeSubTab === 'calendar' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-ayurveda-green-650" size={20} />
                <h2 className="text-xl font-serif font-extrabold text-slate-800 dark:text-zinc-150">Weekly Interactive Planner</h2>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-800">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-zinc-950/20">
                        <th className="px-3.5 py-3 text-left text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Time Slot</th>
                        {calendarDays.map((day, dIdx) => (
                          <th key={dIdx} className="px-3.5 py-3 text-center text-[9px] font-extrabold text-slate-400 dark:text-zinc-300 uppercase tracking-widest">
                            <span className="block">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            <span className="block text-slate-800 dark:text-zinc-200 text-xs font-bold mt-0.5">{day.getDate()}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs text-center font-bold">
                      {timeSlots.map((slot, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/35 dark:hover:bg-zinc-955/20 transition-all">
                          <td className="px-3.5 py-3.5 text-left font-extrabold text-slate-400 uppercase tracking-wider">{slot}</td>
                          {calendarDays.map((day, dIdx) => {
                            const app = findAppointmentBySlot(day, slot);
                            return (
                              <td key={dIdx} className="px-1.5 py-3">
                                {app ? (
                                  <button
                                    onClick={() => setSelectedSlotDetails(app)}
                                    className={`w-full py-2 px-1 rounded-xl text-[9px] font-bold uppercase tracking-wider text-center border duration-200 hover:scale-[1.03] ${
                                      app.status === 'Pending' ? 'bg-yellow-50/80 border-yellow-200 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-900/30' :
                                      app.status === 'Approved' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30' :
                                      app.status === 'Completed' ? 'bg-blue-50/80 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/30' :
                                      'bg-slate-100 border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    {app.fullName.split(' ')[0]}
                                  </button>
                                ) : (
                                  <span className="text-slate-250 dark:text-zinc-800 font-extrabold">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedSlotDetails && (
                <div className="bg-gradient-to-tr from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-md text-left max-w-lg mx-auto relative animate-fade-in">
                  <button onClick={() => setSelectedSlotDetails(null)} className="absolute right-3.5 top-3.5 text-slate-400"><X size={15} /></button>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-805 dark:text-zinc-100">{selectedSlotDetails.fullName}</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                          Age: {selectedSlotDetails.age} | Gender: {selectedSlotDetails.gender} | Contact: {selectedSlotDetails.mobileNumber}
                        </p>
                      </div>
                      {getStatusBadge(selectedSlotDetails.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-y border-slate-100 dark:border-zinc-800/80 py-2.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                      <p>Date: {new Date(selectedSlotDetails.preferredDate).toDateString()}</p>
                      <p>Slot: {selectedSlotDetails.preferredTime}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Symptoms</span>
                      <p className="text-xs text-slate-800 dark:text-zinc-200 font-bold bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl">{selectedSlotDetails.disease}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Subtab 3: alert log */}
          {activeSubTab === 'notifications' && (
            <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h2 className="text-lg font-serif font-extrabold text-slate-800 dark:text-zinc-150 flex items-center gap-2">
                  <Bell size={18} className="text-ayurveda-green-600" />
                  {t('allNotifications')}
                </h2>
                <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-500">
                  {notifications.filter(n => !n.isRead).length} Unread
                </span>
              </div>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell size={32} className="text-slate-350 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs font-semibold">No alerts found.</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const parsed = parseNotification(n.message);
                    return (
                      <div
                        key={n._id}
                        className={`p-4 rounded-2xl border flex justify-between items-start gap-4 transition-all duration-200 ${n.isRead ? 'bg-slate-50/50 dark:bg-zinc-950/20 border-slate-100 dark:border-zinc-800 text-slate-400' : 'bg-green-50/30 dark:bg-emerald-950/15 border-green-100/50 dark:border-emerald-900/35 text-slate-700 dark:text-zinc-200'}`}
                      >
                        <div className="space-y-1.5 text-left flex-1">
                          <p className="font-extrabold text-xs flex items-center gap-1.5">
                            {parsed?.isBooking ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> : <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                            {n.title}
                          </p>
                          {parsed ? (
                            <div className="text-[11px] space-y-0.5 pl-3 border-l border-emerald-500/30 text-slate-600 dark:text-zinc-400">
                              <p><span className="text-slate-400">Patient:</span> {parsed.patientName}</p>
                              <p><span className="text-slate-400">Date/Time:</span> {parsed.date} at {parsed.time}</p>
                              <p><span className="text-slate-400">Symptoms:</span> {parsed.reason}</p>
                            </div>
                          ) : (
                            <p className="text-[11px] leading-relaxed pl-3 border-l border-slate-200 dark:border-zinc-800">{n.message}</p>
                          )}
                          <span className="text-[9px] text-slate-400 block mt-1 pl-3">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        {!n.isRead && (
                          <button onClick={() => markNotificationAsRead(n._id)} className="text-[10px] text-ayurveda-green-600 font-extrabold hover:underline shrink-0">
                            {t('markRead')}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;
