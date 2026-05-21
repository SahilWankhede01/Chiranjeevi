import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-zinc-900 border-green-500';
          let textColor = 'text-green-800 dark:text-green-200';
          let Icon = CheckCircle;

          if (toast.type === 'error') {
            bgColor = 'bg-white dark:bg-zinc-900 border-red-500';
            textColor = 'text-red-800 dark:text-red-200';
            Icon = AlertCircle;
          } else if (toast.type === 'info') {
            bgColor = 'bg-white dark:bg-zinc-900 border-blue-500';
            textColor = 'text-blue-800 dark:text-blue-200';
            Icon = Info;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-white dark:bg-zinc-900 border-amber-500';
            textColor = 'text-amber-800 dark:text-amber-200';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-xl glass-card animate-slide-up pointer-events-auto ${bgColor}`}
              role="alert"
            >
              <div className={textColor}>
                <Icon size={20} className="mt-0.5" />
              </div>
              <div className="flex-1 text-sm font-medium text-slate-700 dark:text-zinc-300">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
