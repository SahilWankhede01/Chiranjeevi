import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
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
  AlertCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { notifications, fetchNotifications, markNotificationAsRead } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('bookings'); // bookings, notifications
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
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

        // Pre-fill remarks drafts with existing remarks
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

  // Update remarks draft in state
  const handleRemarksChange = (id, val) => {
    setRemarksDrafts((prev) => ({ ...prev, [id]: val }));
  };

  // Change Appointment Status (Approve / Reject / Complete)
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
        return <span className="px-2 py-1 text-[10px] font-bold bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30 rounded-full uppercase tracking-wider">Pending</span>;
      case 'Approved':
        return <span className="px-2 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-700 dark:text-ayurveda-green-400 border border-emerald-100 dark:border-emerald-900/30 rounded-full uppercase tracking-wider">Approved</span>;
      case 'Completed':
        return <span className="px-2 py-1 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full uppercase tracking-wider">Completed</span>;
      case 'Rejected':
        return <span className="px-2 py-1 text-[10px] font-bold bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Welcome doctor */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-zinc-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight">
            {t('doctorDashTitle')}
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
            Dr. Yatesh Gahukar | B.A.M.S., MD (Ayu)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'bookings' ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'}`}
          >
            <Calendar size={14} />
            Appointments
          </button>
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'notifications' ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'}`}
          >
            <Bell size={14} />
            {t('allNotifications')}
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && activeSubTab === 'bookings' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('totalBookings')}</span>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-500">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-850 dark:text-zinc-50 mt-2">{analytics.totalAppointments}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('pendingBookings')}</span>
              <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-500 mt-2">{analytics.pendingAppointments}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('approvedBookings')}</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-600">
                <CheckCircle size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-ayurveda-green-600 dark:text-ayurveda-green-400 mt-2">{analytics.approvedAppointments}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('completedBookings')}</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                <CheckCircle size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 mt-2">{analytics.completedBookings}</p>
          </div>

        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between text-left">
            
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center relative">
              <input
                type="text"
                placeholder={t('patientNameSearch')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-150"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450 pointer-events-none">
                <Search size={16} />
              </span>
              <button type="submit" className="hidden">Search</button>
            </form>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-300"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Cancelled</option>
                </select>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date:</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-300 text-slate-500"
                />
              </div>

              {/* Reset filter */}
              {(search || dateFilter || statusFilter !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20">
                <Calendar size={40} className="text-slate-350 mx-auto mb-3" />
                <p className="font-bold text-slate-500 dark:text-zinc-400">No appointments found matching filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto text-left">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-850">
                  <thead className="bg-slate-50/50 dark:bg-zinc-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Patient</th>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Schedule</th>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Symptoms / Issue</th>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Doctor Remarks / Prescription</th>
                      <th scope="col" className="px-6 py-4.5 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 bg-white dark:bg-zinc-900 text-xs text-slate-700 dark:text-zinc-350">
                    {appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-850/20 transition-all">
                        {/* Patient info */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {a.patient?.avatar ? (
                              <img src={a.patient.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-800" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-500">
                                <User size={16} />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900 dark:text-zinc-100 leading-normal">{a.fullName}</p>
                              <p className="text-[10px] text-slate-400 dark:text-zinc-550 leading-tight">
                                {a.age}y / {a.gender} | Contact: {a.mobileNumber}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Timing */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <p className="font-bold text-slate-800 dark:text-zinc-200">{new Date(a.preferredDate).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{a.preferredTime}</p>
                        </td>

                        {/* Problem description */}
                        <td className="px-6 py-4.5 max-w-[200px]">
                          <p className="truncate font-semibold" title={a.disease}>
                            {a.disease}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          {getStatusBadge(a.status)}
                        </td>

                        {/* Remarks input field */}
                        <td className="px-6 py-4.5 min-w-[200px]">
                          <input
                            type="text"
                            value={remarksDrafts[a._id] || ''}
                            onChange={(e) => handleRemarksChange(a._id, e.target.value)}
                            placeholder={t('enterRemarks')}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-1 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-200"
                          />
                        </td>

                        {/* Action buttons */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {actionLoadingId === a._id ? (
                              <div className="w-5 h-5 border-2 border-slate-200 border-t-ayurveda-green-600 rounded-full animate-spin"></div>
                            ) : (
                              <>
                                {/* Approve */}
                                {a.status === 'Pending' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Approved')}
                                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-green-400 transition-colors focus:outline-none"
                                    title="Approve Booking"
                                  >
                                    <Check size={14} className="stroke-[3]" />
                                  </button>
                                )}

                                {/* Mark Completed */}
                                {a.status === 'Approved' && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Completed')}
                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-150 text-blue-700 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 transition-colors focus:outline-none"
                                    title="Mark Completed"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                )}

                                {/* Reject */}
                                {['Pending', 'Approved'].includes(a.status) && (
                                  <button
                                    onClick={() => handleStatusUpdate(a._id, 'Rejected')}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 transition-colors focus:outline-none"
                                    title="Cancel/Reject Booking"
                                  >
                                    <X size={14} className="stroke-[3]" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION PANEL */}
            {totalPages > 1 && (
              <div className="bg-slate-50/50 dark:bg-zinc-900/50 px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-850">
                <span className="text-[11px] text-slate-450 dark:text-zinc-500">
                  Showing {appointments.length} of {totalRecords} records
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-850 disabled:opacity-40 transition-colors focus:outline-none"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    {t('page')} {page} {t('of')} {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-850 disabled:opacity-40 transition-colors focus:outline-none"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeSubTab === 'notifications' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-zinc-550 flex items-center gap-2">
              <Bell size={18} className="text-ayurveda-green-600" />
              {t('allNotifications')}
            </h2>
            <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-500">
              {notifications.filter(n => !n.isRead).length} Unread
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-xs font-semibold">No notifications log found.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 rounded-2xl border flex justify-between items-start gap-4 transition-all duration-200 ${n.isRead ? 'bg-slate-50/50 dark:bg-zinc-950/20 border-slate-100 dark:border-zinc-850 text-slate-400' : 'bg-green-50/30 dark:bg-emerald-950/15 border-green-100/50 dark:border-emerald-900/35 text-slate-700 dark:text-zinc-250'}`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs">{n.title}</p>
                    <p className="text-[11px] leading-relaxed font-medium">{n.message}</p>
                    <span className="text-[9px] text-slate-450 block mt-1">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(n._id)}
                      className="text-[10px] text-ayurveda-green-600 dark:text-ayurveda-green-400 font-bold hover:underline shrink-0"
                    >
                      {t('markRead')}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
