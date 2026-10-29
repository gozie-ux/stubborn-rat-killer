import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const OwnerLoginModal: React.FC = () => {
  const {
    isOwnerLoginModalOpen,
    setIsOwnerLoginModalOpen,
    loginAdmin,
    setActiveView,
    adminLockoutRemaining,
    adminFailedAttempts,
    isLockedOut
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOwnerLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (isLockedOut) {
      setErrorMessage(`Access locked. Please wait ${adminLockoutRemaining}s.`);
      return;
    }
    if (!passcode.trim()) {
      setErrorMessage('Please enter your owner security key');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = loginAdmin(passcode);
      setIsLoading(false);
      if (success) {
        setPasscode('');
        setIsOwnerLoginModalOpen(false);
        setActiveView('admin');
      } else {
        if (!isLockedOut) {
          setErrorMessage('Incorrect Owner Security Passcode. Access denied.');
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-950 border-2 border-red-600/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.35)] card-3d">
        {/* Top Close Button */}
        <button
          onClick={() => {
            setIsOwnerLoginModalOpen(false);
            setErrorMessage('');
          }}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Brand & Shield */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-red-950/80 border border-red-500/50 shadow-inner">
            <Lock className="w-8 h-8 text-yellow-400" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-950/60 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              AUTHORIZED PERSONNEL ONLY
            </span>
            <h2 className="text-xl font-black text-white font-['Outfit'] mt-1.5 tracking-tight">
              Owner Security Console
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Enter your passcode to manage customer orders, inventory, and payment settings.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
                <span>Owner Passcode</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Confidential</span>
            </label>

            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                disabled={isLockedOut || isLoading}
                placeholder={isLockedOut ? `Locked out (${adminLockoutRemaining}s)` : 'Enter passcode...'}
                autoFocus={!isLockedOut}
                className="w-full bg-black border-2 border-neutral-800 focus:border-yellow-400 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={isLockedOut}
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 disabled:opacity-30"
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLockedOut ? (
              <div className="mt-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/70 text-xs font-bold text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                <span>
                  Console Locked. Wait <strong className="text-white font-mono">{adminLockoutRemaining}s</strong> before retrying.
                </span>
              </div>
            ) : errorMessage ? (
              <p className="mt-2 text-xs font-bold text-red-400 flex items-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            ) : adminFailedAttempts > 0 ? (
              <p className="mt-2 text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>{5 - adminFailedAttempts} attempts remaining before 5-minute lockout.</span>
              </p>
            ) : null}
          </div>

          {/* Security Notice */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security Protected:</span>
            </div>
            <p className="leading-normal">
              This portal is restricted to the store owner. Access attempts are monitored and rate-limited to safeguard customer records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLoading || isLockedOut}
              className="w-full py-3.5 px-4 rounded-2xl btn-3d-yellow text-black font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : isLockedOut ? (
                <span>Locked Out ({adminLockoutRemaining}s)</span>
              ) : (
                <>
                  <span>Log In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOwnerLoginModalOpen(false);
                setErrorMessage('');
              }}
              className="w-full py-2.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
            >
              Cancel &amp; Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
