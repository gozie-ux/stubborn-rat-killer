import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Send, 
  Truck, 
  Lock, 
  MessageCircle,
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    setSelectedCategory, 
    setActiveView, 
    showToast,
    setIsAdvisorOpen,
    setIsOwnerLoginModalOpen,
    isAdminAuthenticated
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing! You will receive our monthly fumigation & seasonal pest advisory.', 'success');
      setNewsletterEmail('');
    }
  };

  const handleCatClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs mt-16 relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <BrandLogo size="lg" />
              <div className="flex flex-col">
                <span className="font-black text-xl text-slate-950 tracking-tight font-['Outfit']">
                  STUBBORN RAT KILLER
                </span>
                <span className="text-[10px] text-amber-700 font-extrabold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" /> 
                  KILLAPEST RESOURCES • +234 808 985 4753
                </span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  Permanent Knockdown Solutions
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-normal">
              Nigeria’s direct-to-consumer store for high-potency pest and rodent eradication. Trusted by hotels, poultry farms, restaurants, estate managers, and homeowners nationwide.
            </p>

            <div className="space-y-2.5 pt-1 text-slate-700">
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Exterminator Hotlines: <strong className="text-slate-900 font-mono">+234 808 985 4753</strong></span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Dispatch Desk: <strong className="text-slate-900 font-mono">+234 808 985 4753</strong></span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>Logistics & Chemical Depot: <strong className="text-slate-900">Killapest Resources, Ikeja / Lagos</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Product Specifications */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider font-['Outfit']">
              Product Specifications
            </h4>
            <ul className="space-y-2 font-medium text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="text-amber-500">⚡</span> <span>45m - 2h Knockdown Action</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span> <span>Zero Known Resistance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span> <span>Odorless Mummifier Formula</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-600">🥄</span> <span>Free Dosing Spoon Included</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-600">🌙</span> <span>Night Placement Protocol</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-slate-700">📦</span> <span>100g Sealed Security Jar</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Operations */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider font-['Outfit']">
              Customer Support & Dispatch
            </h4>
            <ul className="space-y-2 font-medium text-slate-600">
              <li>
                <a
                  href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20want%20to%20order%20the%20rat%20killer%20bait."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-700 text-emerald-600 flex items-center gap-1 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> <span>Order on WhatsApp</span>
                </a>
              </li>
              <li>
                <button onClick={() => setActiveView('order-tracking')} className="hover:text-amber-600">
                  • Track Dispatch Order
                </button>
              </li>
              <li>
                <span className="text-slate-500">• Same-Day Dispatch (Lagos & Ogun)</span>
              </li>
              <li>
                <span className="text-slate-500">• Interstate Delivery (24-48hrs)</span>
              </li>
              <li>
                <span className="text-slate-500">• Commercial Bulk Wholesale</span>
              </li>
              <li>
                <span className="text-slate-500">• Moniepoint / Card / Transfer</span>
              </li>
              <li className="pt-2 border-t border-slate-200">
                <a
                  href="https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-700 text-slate-700 flex items-center gap-1.5 font-semibold"
                >
                  <span className="w-4 h-4 rounded bg-[#3db83a] text-white flex items-center justify-center text-[9px] font-black tracking-tighter">Ji</span>
                  <span>Buy on Jiji (Lekki Store)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://jiji.ng/ikeja/cleaning-services/most-wanted-rat-killer-expert-guaranteed-results-ub485cR3z0x5xozhbjHDUzqb.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-700 text-slate-700 flex items-center gap-1.5 font-semibold"
                >
                  <span className="w-4 h-4 rounded bg-[#3db83a] text-white flex items-center justify-center text-[9px] font-black tracking-tighter">Ji</span>
                  <span>Buy on Jiji (Ikeja Store)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider font-['Outfit']">
              Seasonal Pest Alerts
            </h4>
            <p className="text-slate-500 text-xs font-normal">
              Subscribe for pest prevention tips, seasonal discounts, and rodent control updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
              <button
                type="submit"
                className="w-full py-2.5 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SUBSCRIBE FOR ALERTS</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar with Payment Trust Badges & Discreet Owner Portal */}
        <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-3">
            <p className="text-slate-500">
              © {new Date().getFullYear()} STUBBORN RAT KILLER. All rights reserved.
            </p>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActiveView('admin');
                } else {
                  setIsOwnerLoginModalOpen(true);
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1 font-mono group"
              title="Store Owner & Inventory Manager Access"
            >
              <Lock className="w-3 h-3 group-hover:text-slate-800 text-slate-400" />
              <span>{isAdminAuthenticated ? '👑 Owner Console (Active)' : 'Owner Portal'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Paystack</span>
            <span>•</span>
            <span>Moniepoint</span>
            <span>•</span>
            <span>Bank Transfer</span>
            <span>•</span>
            <span className="text-red-600 font-bold">Pay On Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
