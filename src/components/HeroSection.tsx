import React from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { 
  Flame, 
  ArrowRight, 
  Truck, 
  Zap, 
  MessageCircle, 
  ShieldCheck 
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { products, addToCart, setIsCheckoutOpen } = useStore();
  const product = products[0];

  const handleQuickOrder = () => {
    const el = document.getElementById('product-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (product) {
      addToCart(product, 1);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200 overflow-hidden">
      {/* Soft Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-4xl space-y-6 text-left">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 shrink-0" />
              <span>NIGERIA'S #1 RAT ERADICATOR</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              DIRECT HOTLINE: <strong className="text-red-600 font-black">+234 808 985 4753</strong>
            </span>
          </div>

          {/* Headline & Shield Logo */}
          <div className="flex items-start gap-4 sm:gap-6">
            <BrandLogo size="lg" className="shrink-0 hidden sm:inline-flex mt-1" />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-tight sm:leading-none tracking-tight font-['Outfit']">
              Wipe Out <span className="text-red-600">Stubborn Rats</span> in 45 Minutes to 2 Hours.
            </h1>
          </div>

          {/* Description Paragraph */}
          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl font-normal">
            Don’t waste your hard-earned money on fake supermarket pellets. <strong className="text-slate-950 font-bold">STUBBORN RAT KILLER</strong> is a fast-acting premix bait engineered with zero known rodent resistance. One nocturnal feed eliminates giant sewer rats and ceiling mice — drying them up odorless with zero foul stink.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={handleQuickOrder}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 group text-center shadow-md cursor-pointer"
            >
              <span>ORDER STUBBORN RAT KILLER (₦5,800)</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20want%20to%20order%20the%20Stubborn%20Rat%20Killer%20bait."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 group text-center shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>

          {/* Jiji Option Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#3db83a] text-white flex items-center justify-center font-black text-[9px] tracking-tighter">Ji</span>
              Prefer Jiji? Buy via:
            </span>
            <a
              href="https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-black underline"
            >
              Lekki Store
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://jiji.ng/ikeja/cleaning-services/most-wanted-rat-killer-expert-guaranteed-results-ub485cR3z0x5xozhbjHDUzqb.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-black underline"
            >
              Ikeja Store
            </a>
          </div>

          {/* Guarantees Row */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 border-t border-slate-200 text-xs font-bold">
            <div className="flex items-center gap-2.5 text-slate-800 bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-slate-900 font-extrabold">Dead in 45m – 2h</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-800 bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <Truck className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-slate-900 font-extrabold">24–48hr Nationwide Dispatch</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-800 bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-900 font-extrabold">Odorless Mummifier</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

