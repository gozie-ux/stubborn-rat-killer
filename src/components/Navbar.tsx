import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { 
  ShoppingCart, 
  Heart, 
  SlidersHorizontal, 
  Menu, 
  X, 
  Truck, 
  MessageCircle,
  Clock,
  Star,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    cartSubtotal,
    wishlistCount,
    setIsCartDrawerOpen,
    setIsWishlistDrawerOpen,
    activeView,
    setActiveView,
    formatPrice,
    isAdminAuthenticated
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToAnchor = (id: string) => {
    setActiveView('shop');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-8">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => { setActiveView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 sm:flex-initial"
            id="brand-logo-btn"
          >
            <div className="shrink-0">
              <div className="hidden sm:block">
                <BrandLogo size="md" className="transform group-hover:scale-105 transition-transform" />
              </div>
              <div className="sm:hidden">
                <BrandLogo size="sm" className="transform group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
                <span className="font-black text-base sm:text-2xl tracking-tighter text-red-600 font-['Outfit'] whitespace-nowrap">
                  STUBBORN
                </span>
                <span className="font-black text-base sm:text-2xl tracking-tighter text-amber-500 font-['Outfit'] whitespace-nowrap">
                  RAT KILLER
                </span>
              </div>
              <div className="hidden xs:flex sm:flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-600 font-black tracking-wider uppercase font-mono">
                <span className="text-red-600 font-bold">📞 +234 808 985 4753</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">NAFDAC Regulated</span>
              </div>
            </div>
          </div>

          {/* Center Quick Navigation Links (Single Product Anchors) */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollToAnchor('product-overview')}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-slate-100 transition-colors"
            >
              Buy Rat Killer (₦5,800)
            </button>
            <button
              onClick={() => scrollToAnchor('how-to-use')}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>How to Use</span>
            </button>
            <button
              onClick={() => scrollToAnchor('reviews')}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Customer Reviews</span>
            </button>
            <button
              onClick={() => scrollToAnchor('dispatch-schedule')}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-amber-500" />
              <span>Delivery Info</span>
            </button>
            <button
              onClick={() => scrollToAnchor('faqs')}
              className="px-3 py-2 rounded-xl hover:text-red-600 hover:bg-slate-100 transition-colors"
            >
              Questions & Answers
            </button>
            <a
              href="https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 font-bold shadow-2xs"
            >
              <span className="w-3.5 h-3.5 rounded bg-[#3db83a] text-white flex items-center justify-center text-[8px] font-black tracking-tighter">Ji</span>
              <span>Shop on Jiji</span>
            </a>
          </div>

          {/* Right Action Icons & Direct Order */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Direct WhatsApp Quick Order */}
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20want%20to%20order%20the%20rat%20killer%20bait."
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden xl:inline">WhatsApp Order</span>
            </a>

            {/* Order Tracking */}
            <button
              onClick={() => setActiveView('order-tracking')}
              id="nav-tracking-btn"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeView === 'order-tracking'
                  ? 'btn-3d-yellow text-slate-950'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
              title="Track your order delivery"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span className="hidden xl:inline">Track Order</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistDrawerOpen(true)}
              id="nav-wishlist-btn"
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-red-600 transition-all group"
              title="My Wishlist"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:fill-red-500 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-red-600 text-white font-black text-[9px] sm:text-[10px] rounded-full flex items-center justify-center shadow-sm border border-white animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              id="nav-cart-btn"
              className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl btn-3d-yellow text-slate-950 font-black text-xs transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center border border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-['Outfit'] font-black">
                {cartCount > 0 ? formatPrice(cartSubtotal) : 'Cart'}
              </span>
            </button>

            {/* Owner HQ Button */}
            {isAdminAuthenticated && (
              <button
                onClick={() => setActiveView(activeView === 'admin' ? 'shop' : 'admin')}
                id="nav-admin-btn"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeView === 'admin'
                    ? 'btn-3d-red text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
                }`}
                title="Owner Inventory & Order Console"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden md:inline">
                  {activeView === 'admin' ? 'Exit Owner HQ' : '👑 Owner HQ'}
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sub-bar on Desktop: Single-Product Highlights Bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-t border-slate-100 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-red-600">
              <Zap className="w-3.5 h-3.5 fill-red-500" />
              <span>Kills Rats in 45 Mins – 2 Hours</span>
            </span>
            <span className="text-slate-700">
              🐀 Kills Big Bush Rats & Ceiling Mice
            </span>
            <span className="text-slate-700">
              🥄 Free Measuring Spoon Inside
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-emerald-600 flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock for Same-Day Delivery in Lagos
            </span>
            <span className="text-slate-300">|</span>
            <a
              href="tel:+2348089854753"
              className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Call: +234 808 985 4753
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-lg animate-in slide-in-from-top-4">
          <a
            href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20want%20to%20order%20the%20rat%20killer%20bait."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp (+234 808 985 4753)</span>
          </a>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => scrollToAnchor('product-overview')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-black text-slate-800 hover:border-amber-400"
            >
              🛒 Buy Bottle (₦5,800)
            </button>
            <button
              onClick={() => scrollToAnchor('how-to-use')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-black text-slate-800 hover:border-amber-400"
            >
              🌙 How to Use
            </button>
            <button
              onClick={() => scrollToAnchor('reviews')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-black text-slate-800 hover:border-amber-400"
            >
              ⭐ Customer Reviews
            </button>
            <button
              onClick={() => scrollToAnchor('dispatch-schedule')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-black text-slate-800 hover:border-amber-400"
            >
              🚚 Delivery Info
            </button>
          </div>

          {/* Jiji Quick Links in Mobile Menu */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <span className="w-4 h-4 rounded bg-[#3db83a] text-white flex items-center justify-center text-[9px] font-black tracking-tighter">Ji</span>
              <span>Prefer Shopping on Jiji.ng?</span>
            </div>
            <a
              href="https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
              target="_blank"
              rel="noreferrer"
              className="w-full p-2.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-800 hover:text-emerald-700 block text-center shadow-xs"
            >
              Order on Jiji Store →
            </a>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => { setActiveView('order-tracking'); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-black"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              Track My Delivery
            </button>

            {isAdminAuthenticated && (
              <button
                onClick={() => { setActiveView(activeView === 'admin' ? 'shop' : 'admin'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl btn-3d-yellow text-slate-950 text-xs font-black"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeView === 'admin' ? 'Exit Owner HQ' : '👑 Store Owner HQ Console'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
