import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, Truck, PhoneCall, Zap, Sparkles, Flame, Radio } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { currency, setCurrency, setIsAdvisorOpen } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-950 text-slate-200 text-xs border-b border-slate-800 relative z-30 shadow-sm">
      {/* Top Hazard Stripe Accent Line */}
      <div className="h-1 w-full hazard-stripes" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 overflow-hidden">
        {/* Left Announcements */}
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs font-semibold w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-slate-950 font-black bg-gradient-to-r from-amber-400 to-yellow-400 px-2.5 sm:px-3 py-1 rounded-lg shadow-sm uppercase tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap shrink-0">
            <Flame className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>SPECIAL OFFER: BUY 5 JARS & ABOVE, GET 1 FREE JAR!</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs shrink-0">
            <span className="text-amber-400 font-bold hidden xs:inline">OFFER ENDS:</span>
            <span className="font-mono text-red-400 font-black bg-slate-950 px-1.5 py-0.5 rounded border border-red-500/30">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>SAME-DAY LAGOS DELIVERY</span>
          </span>
        </div>

        {/* Center/Right Trust & Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs w-full sm:w-auto">
          <a
            href="tel:+2348089854753"
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] sm:text-xs"
          >
            <PhoneCall className="w-3 h-3 text-red-400 shrink-0" />
            <span className="hidden md:inline font-bold text-amber-400">Call to Order:</span>
            <span className="font-extrabold text-white font-mono">+234 808 985 4753</span>
          </a>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner shrink-0">
            <button
              onClick={() => setCurrency('NGN')}
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black transition-all ${
                currency === 'NGN'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ₦ NGN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black transition-all ${
                currency === 'USD'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

