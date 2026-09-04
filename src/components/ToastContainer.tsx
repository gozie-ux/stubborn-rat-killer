import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let bgColor = 'bg-black border-2 border-neutral-800 text-neutral-100 card-3d shadow-[0_4px_0_#262626]';
        let Icon = Info;
        let iconColor = 'text-yellow-400';

        if (toast.type === 'success') {
          bgColor = 'bg-black border-2 border-yellow-400 text-white card-3d shadow-[0_4px_0_#ca8a04]';
          Icon = CheckCircle2;
          iconColor = 'text-yellow-400';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-red-950/95 border-2 border-yellow-400 text-yellow-200 card-3d shadow-[0_4px_0_#991b1b]';
          Icon = AlertTriangle;
          iconColor = 'text-yellow-400';
        } else if (toast.type === 'error') {
          bgColor = 'bg-red-950/95 border-2 border-red-500 text-white card-3d shadow-[0_4px_0_#991b1b]';
          Icon = XCircle;
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgColor}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-xs font-bold flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
