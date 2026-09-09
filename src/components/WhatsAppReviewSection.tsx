import React, { useRef, useState } from 'react';
import { 
  ArrowLeft, 
  Video, 
  Phone, 
  MoreVertical, 
  Camera, 
  Mic, 
  CheckCheck, 
  ShieldCheck, 
  MessageCircle, 
  Star,
  PackageCheck,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppReviewSection: React.FC = () => {
  const { setActiveView } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const handleOrderClick = () => {
    const el = document.getElementById('product-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveView('shop');
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 285;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToReview = (index: number) => {
    setActiveReviewIndex(index);
    if (scrollRef.current) {
      const card = scrollRef.current.children[index] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 285;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex <= 3 && newIndex !== activeReviewIndex) {
        setActiveReviewIndex(newIndex);
      }
    }
  };

  return (
    <div id="reviews" className="rounded-2xl bg-white border border-slate-200 p-3 sm:p-4 lg:p-5 space-y-3.5 shadow-xs overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-black uppercase tracking-wider">
            <MessageCircle className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
            <span>4 VERIFIED WHATSAPP REVIEWS</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-950 font-['Outfit']">
            Real Customer Reviews & Proof
          </h3>
          <p className="text-[11px] text-slate-500 font-normal max-w-xl">
            Compare 4 verified WhatsApp chat proofs side by side. Swipe or click to inspect orders, receipts, and waybills.
          </p>
        </div>

        {/* Rating & Arrows */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 shrink-0">
            <div className="text-sm font-black text-emerald-600 font-mono">5.0</div>
            <div className="text-left">
              <div className="flex text-amber-400 text-[9px]">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[8px] text-slate-500 font-bold">4 Verified Chats</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              title="Scroll left"
              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => scroll('right')}
              title="Scroll right"
              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <button
          onClick={() => scrollToReview(0)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap shrink-0 border ${
            activeReviewIndex === 0
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
            activeReviewIndex === 0 ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
          }`}>1</span>
          <span>John Ebuka (6 Jars)</span>
        </button>

        <button
          onClick={() => scrollToReview(1)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap shrink-0 border ${
            activeReviewIndex === 1
              ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
            activeReviewIndex === 1 ? 'bg-white text-amber-800' : 'bg-amber-600 text-white'
          }`}>2</span>
          <span>Alhaji Adeshina (21 Jars)</span>
        </button>

        <button
          onClick={() => scrollToReview(2)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap shrink-0 border ${
            activeReviewIndex === 2
              ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
            activeReviewIndex === 2 ? 'bg-white text-blue-800' : 'bg-blue-600 text-white'
          }`}>3</span>
          <span>Barakat (10 Jars Ibadan)</span>
        </button>

        <button
          onClick={() => scrollToReview(3)}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap shrink-0 border ${
            activeReviewIndex === 3
              ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <span className={`w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center ${
            activeReviewIndex === 3 ? 'bg-white text-purple-800' : 'bg-purple-600 text-white'
          }`}>4</span>
          <span>Engr. Felix (Abuja Kuda)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* COMPACT HORIZONTAL SIDE-BY-SIDE REVIEWS TRACK                            */}
      {/* ========================================================================= */}
      <div 
        ref={scrollRef}
        onScroll={handleScrollEvent}
        className="flex flex-row overflow-x-auto gap-3 sm:gap-4 items-stretch scroll-smooth pb-2 px-0.5 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 1: JOHN EBUKA                                                      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-[74vw] max-w-[265px] sm:w-[275px] shrink-0 snap-start rounded-xl bg-slate-50/90 border border-emerald-500/30 p-2.5 flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow">
          
          {/* Card Mini Header */}
          <div className="space-y-0.5 border-b border-slate-200 pb-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">
                  1
                </span>
                <span className="font-black text-slate-950 text-xs font-['Outfit']">John Ebuka</span>
              </div>
              <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase">
                Repeat Buyer
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-800">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span className="truncate">"We have bought from you before"</span>
            </div>
          </div>

          {/* WhatsApp Phone Mockup 1 (Chat Height: 220px) */}
          <div className="w-full rounded-[14px] bg-[#0b141a] border-2 border-slate-800 shadow-xs overflow-hidden font-sans text-white select-none relative">
            {/* Status Bar */}
            <div className="bg-[#121b22] px-2.5 py-0.5 flex items-center justify-between text-[8px] text-slate-400 border-b border-white/5 font-mono">
              <span className="font-semibold">6:45 PM</span>
              <div className="flex items-center gap-1">
                <span>4G 1.6K/S</span>
                <span>95%</span>
              </div>
            </div>

            {/* Header Bar */}
            <div className="bg-[#1f2c34] px-2 py-1 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-white/90" />
                <div className="w-5 h-5 rounded-full bg-[#8e24aa] flex items-center justify-center font-bold text-[9px] text-white">
                  J
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-[10px] text-white">John Ebuka</div>
                  <span className="text-[8px] text-[#8696a0]">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Video className="w-2.5 h-2.5" />
                <Phone className="w-2.5 h-2.5" />
                <MoreVertical className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-1.5 space-y-1 bg-[#0b141a] h-[220px] flex flex-col justify-end text-[10px] relative overflow-y-auto">
              {/* Quote 1 */}
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] p-1 space-y-0.5">
                  <div className="bg-[#182229] border-l-2 border-emerald-500 rounded p-0.5 text-[8px]">
                    <p className="font-bold text-emerald-400">You</p>
                    <p className="text-slate-300">That's 34,800 naira for 6 jars</p>
                  </div>
                  <div className="px-0.5 flex items-baseline justify-between gap-1">
                    <p className="text-[9px] font-medium text-white">How much per jar?</p>
                    <span className="text-[7px] text-[#8696a0]">5:39 PM</span>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] px-1.5 py-0.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-[9px] font-semibold text-white">We have bought from you before</p>
                    <span className="text-[7px] text-[#8696a0]">5:40 PM</span>
                  </div>
                </div>
              </div>

              {/* Product catalog card (reduced image height: h-11) */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] overflow-hidden">
                  <div className="p-0.5">
                    <img 
                      src="/images/rat-killer-1.jpg" 
                      alt="STUBBORN RAT KILLER BAIT" 
                      className="w-full h-11 object-contain bg-[#121b22] rounded"
                    />
                  </div>
                  <div className="p-1 pt-0 space-y-0.5">
                    <p className="font-bold text-[8px] text-white">STUBBORN™ RAT KILLER</p>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="font-semibold text-emerald-100">NGN 5,800.00</span>
                      <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Outgoing */}
              <div className="flex justify-end">
                <div className="rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] px-1.5 py-0.5 space-y-0.5">
                  <p className="text-[9px] text-white">Same price, no changes</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[9px] font-bold text-white">5800 naira per jar</span>
                    <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="bg-[#121b22] px-2 py-1 flex items-center gap-1 border-t border-white/5 text-[#8696a0]">
              <div className="flex-1 bg-[#202c33] rounded-full px-2 py-0.5 flex items-center justify-between text-[9px]">
                <span>Message</span>
                <Camera className="w-2.5 h-2.5" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Order Volume</span>
              <p className="font-black text-slate-900">6 Jars (₦34,800)</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Price / Jar</span>
              <p className="font-black text-emerald-700">₦5,800 Flat</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Proof</span>
              <p className="font-bold text-slate-800">Repeat Buyer</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Waybill</span>
              <p className="font-bold text-slate-800">Park Waybill</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              onClick={handleOrderClick}
              className="flex-1 py-1.5 btn-3d-yellow text-slate-950 font-black text-[10px] rounded-md shadow-2xs flex items-center justify-center gap-1"
            >
              <PackageCheck className="w-3 h-3" />
              <span>ORDER 6 JARS</span>
            </button>
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20saw%20John%20Ebuka%27s%20review%20and%20I%20want%20to%20order"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black text-[10px] rounded-md flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              <MessageCircle className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 2: ALHAJI ADESHINA                                                 */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-[74vw] max-w-[265px] sm:w-[275px] shrink-0 snap-start rounded-xl bg-slate-50/90 border border-amber-500/30 p-2.5 flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow">
          
          {/* Card Mini Header */}
          <div className="space-y-0.5 border-b border-slate-200 pb-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white font-black text-[9px] flex items-center justify-center">
                  2
                </span>
                <span className="font-black text-slate-950 text-xs font-['Outfit']">Alhaji Adeshina</span>
              </div>
              <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[8px] font-black uppercase">
                Wholesale
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-amber-800">
              <CheckCircle2 className="w-2.5 h-2.5 text-amber-600 shrink-0" />
              <span className="truncate">"Thanks greatly" — 21 Jars Waybill</span>
            </div>
          </div>

          {/* WhatsApp Phone Mockup 2 (Chat Height: 220px) */}
          <div className="w-full rounded-[14px] bg-[#0b141a] border-2 border-slate-800 shadow-xs overflow-hidden font-sans text-white select-none relative">
            {/* Status Bar */}
            <div className="bg-[#121b22] px-2.5 py-0.5 flex items-center justify-between text-[8px] text-slate-400 border-b border-white/5 font-mono">
              <span className="font-semibold">6:43 PM</span>
              <div className="flex items-center gap-1">
                <span>4G</span>
                <span>94%</span>
              </div>
            </div>

            {/* Header Bar */}
            <div className="bg-[#1f2c34] px-2 py-1 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-white/90" />
                <div className="w-5 h-5 rounded-full bg-[#8e24aa] flex items-center justify-center font-bold text-[9px] text-white">
                  A
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-[10px] text-white">Alhaji Adeshina</div>
                  <span className="text-[8px] text-[#8696a0]">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Video className="w-2.5 h-2.5" />
                <Phone className="w-2.5 h-2.5" />
                <MoreVertical className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-1.5 space-y-1 bg-[#0b141a] h-[220px] flex flex-col justify-end text-[10px] relative overflow-y-auto">
              {/* Sent? */}
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] px-1.5 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[9px] font-semibold">Sent?</p>
                    <span className="text-[7px] text-[#8696a0]">12:18 PM</span>
                  </div>
                </div>
              </div>

              {/* Waybill Parcel (reduced image height: h-11) */}
              <div className="flex justify-end">
                <div className="max-w-[88%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] p-1 space-y-0.5">
                  <div className="relative rounded overflow-hidden bg-black/40">
                    <img 
                      src="/images/rat-killer-1.jpg" 
                      alt="Dispatched 21 jars parcel" 
                      className="w-full h-11 object-cover"
                    />
                    <div className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/70 text-[6.5px] font-bold text-white uppercase">
                      21 Jars Packed
                    </div>
                  </div>
                  <div className="px-0.5 text-[9px]">
                    <p className="font-semibold text-white">Yes Sir. Driver: <span className="font-mono text-white underline font-bold">07017266331</span></p>
                    <div className="flex items-baseline justify-between text-[8px]">
                      <span className="text-emerald-100">Waybill: 4k</span>
                      <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra bonus */}
              <div className="flex justify-end">
                <div className="max-w-[88%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] px-1.5 py-0.5 text-[8.5px]">
                  <p className="text-emerald-50">+5g extra per jar (21 jars at 20 price).</p>
                  <div className="flex justify-end">
                    <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] px-1.5 py-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[9px] font-bold text-white">Thanks greatly</p>
                    <span className="text-[7px] text-[#8696a0]">2:25 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="bg-[#121b22] px-2 py-1 flex items-center gap-1 border-t border-white/5 text-[#8696a0]">
              <div className="flex-1 bg-[#202c33] rounded-full px-2 py-0.5 flex items-center justify-between text-[9px]">
                <span>Message</span>
                <Camera className="w-2.5 h-2.5" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Quantity</span>
              <p className="font-black text-slate-900">21 Jars Bulk</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Driver Phone</span>
              <p className="font-black text-amber-700 font-mono">07017266331</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Waybill</span>
              <p className="font-bold text-slate-800">4,000 Naira</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Bonus Added</span>
              <p className="font-bold text-emerald-700">+5g Extra / Jar</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              onClick={handleOrderClick}
              className="flex-1 py-1.5 btn-3d-yellow text-slate-950 font-black text-[10px] rounded-md shadow-2xs flex items-center justify-center gap-1"
            >
              <PackageCheck className="w-3 h-3" />
              <span>ORDER BULK</span>
            </button>
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20saw%20Alhaji%20Adeshina%27s%20review%20and%20I%20want%20to%20order"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black text-[10px] rounded-md flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              <MessageCircle className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 3: BARAKAT GANIYU                                                  */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-[74vw] max-w-[265px] sm:w-[275px] shrink-0 snap-start rounded-xl bg-slate-50/90 border border-blue-500/30 p-2.5 flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow">
          
          {/* Card Mini Header */}
          <div className="space-y-0.5 border-b border-slate-200 pb-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center">
                  3
                </span>
                <span className="font-black text-slate-950 text-xs font-['Outfit']">Barakat Ganiyu</span>
              </div>
              <span className="px-1 py-0.2 rounded bg-blue-100 text-blue-800 text-[8px] font-black uppercase">
                Ibadan
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-blue-800">
              <CheckCircle2 className="w-2.5 h-2.5 text-blue-600 shrink-0" />
              <span className="truncate">"Send to ibadan:" — 10 Jars (₦57,000)</span>
            </div>
          </div>

          {/* WhatsApp Phone Mockup 3 (Chat Height: 220px) */}
          <div className="w-full rounded-[14px] bg-[#0b141a] border-2 border-slate-800 shadow-xs overflow-hidden font-sans text-white select-none relative">
            {/* Status Bar */}
            <div className="bg-[#121b22] px-2.5 py-0.5 flex items-center justify-between text-[8px] text-slate-400 border-b border-white/5 font-mono">
              <span className="font-semibold">6:47 PM</span>
              <div className="flex items-center gap-1">
                <span>4G 916B/S</span>
                <span>95%</span>
              </div>
            </div>

            {/* Header Bar */}
            <div className="bg-[#1f2c34] px-2 py-1 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-white/90" />
                <div className="w-5 h-5 rounded-full bg-[#8e24aa] flex items-center justify-center font-bold text-[9px] text-white">
                  B
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-[10px] text-white">Barakat Ganiyu</div>
                  <span className="text-[8px] text-[#8696a0]">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Video className="w-2.5 h-2.5" />
                <Phone className="w-2.5 h-2.5" />
                <MoreVertical className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-1.5 space-y-1 bg-[#0b141a] h-[220px] flex flex-col justify-end text-[10px] relative overflow-y-auto">
              {/* Discount request */}
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] p-1 space-y-0.5">
                  <p className="text-[9px] leading-snug">
                    Give us discount like you did the last time, 5500 and we shall buy 10 jars
                  </p>
                  <div className="flex justify-end">
                    <span className="text-[7px] text-[#8696a0]">5:42 PM</span>
                  </div>
                </div>
              </div>

              {/* Price Agreement */}
              <div className="flex justify-end">
                <div className="max-w-[90%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] px-1.5 py-0.5 space-y-0.5">
                  <p className="text-[9px] text-white">We can do 10 jars for 5700 naira.</p>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[9px] font-bold text-white">That's 57,000 naira</span>
                    <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              {/* Moniepoint payment */}
              <div className="flex justify-end">
                <div className="max-w-[90%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] px-1.5 py-0.5 text-[8.5px]">
                  <p className="font-mono font-bold text-white underline">6789725821</p>
                  <p className="font-bold text-white text-[8px]">DOLIVA RESOURCES LTD (Moniepoint)</p>
                  <div className="flex justify-end">
                    <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] px-1.5 py-0.5">
                  <div className="flex items-center gap-1">
                    <p className="text-[9px] font-semibold text-white">Send to ibadan:</p>
                    <span className="text-[7px] text-[#8696a0]">5:47 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="bg-[#121b22] px-2 py-1 flex items-center gap-1 border-t border-white/5 text-[#8696a0]">
              <div className="flex-1 bg-[#202c33] rounded-full px-2 py-0.5 flex items-center justify-between text-[9px]">
                <span>Message</span>
                <Camera className="w-2.5 h-2.5" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Order Total</span>
              <p className="font-black text-slate-900">10 Jars (₦57,000)</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Account</span>
              <p className="font-black text-blue-700 font-mono">6789725821</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Beneficiary</span>
              <p className="font-bold text-slate-800 text-[8px] truncate">DOLIVA RESOURCES</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Destination</span>
              <p className="font-bold text-slate-800">Ibadan, Oyo</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              onClick={handleOrderClick}
              className="flex-1 py-1.5 btn-3d-yellow text-slate-950 font-black text-[10px] rounded-md shadow-2xs flex items-center justify-center gap-1"
            >
              <PackageCheck className="w-3 h-3" />
              <span>ORDER 10 JARS</span>
            </button>
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20saw%20Barakat%20Ganiyu%27s%20review%20and%20I%20want%20to%20order"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black text-[10px] rounded-md flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              <MessageCircle className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 4: ENGR. FELIX OLADIPO                                             */}
        {/* ----------------------------------------------------------------------- */}
        <div className="w-[74vw] max-w-[265px] sm:w-[275px] shrink-0 snap-start rounded-xl bg-slate-50/90 border border-purple-500/30 p-2.5 flex flex-col justify-between space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow">
          
          {/* Card Mini Header */}
          <div className="space-y-0.5 border-b border-slate-200 pb-1.5">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-black text-[9px] flex items-center justify-center">
                  4
                </span>
                <span className="font-black text-slate-950 text-xs font-['Outfit']">Engr. Felix Oladipo</span>
              </div>
              <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-800 text-[8px] font-black uppercase">
                Abuja
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-purple-800">
              <CheckCircle2 className="w-2.5 h-2.5 text-purple-600 shrink-0" />
              <span className="truncate">"Your payment is received" — Kuda Bank</span>
            </div>
          </div>

          {/* WhatsApp Phone Mockup 4 (Chat Height: 220px) */}
          <div className="w-full rounded-[14px] bg-[#0b141a] border-2 border-slate-800 shadow-xs overflow-hidden font-sans text-white select-none relative">
            {/* Status Bar */}
            <div className="bg-[#121b22] px-2.5 py-0.5 flex items-center justify-between text-[8px] text-slate-400 border-b border-white/5 font-mono">
              <span className="font-semibold">6:49 PM</span>
              <div className="flex items-center gap-1">
                <span>4G 20B/S</span>
                <span>96%</span>
              </div>
            </div>

            {/* Header Bar */}
            <div className="bg-[#1f2c34] px-2 py-1 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-white/90" />
                <div className="w-5 h-5 rounded-full bg-[#6a1b9a] flex items-center justify-center font-bold text-[9px] text-white">
                  F
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-[10px] text-white">Engr. Felix Oladipo</div>
                  <span className="text-[8px] text-[#8696a0]">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Video className="w-2.5 h-2.5" />
                <Phone className="w-2.5 h-2.5" />
                <MoreVertical className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-1.5 space-y-1 bg-[#0b141a] h-[220px] flex flex-col justify-end text-[10px] relative overflow-y-auto">
              {/* Kuda Receipt (reduced padding) */}
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] overflow-hidden">
                  <div className="bg-[#ffffff] text-slate-900 p-1.5 border-b border-slate-200">
                    <div className="flex items-center justify-between pb-0.5 border-b border-slate-100">
                      <span className="font-black text-[9px] text-[#40196d]">kuda.</span>
                      <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[6.5px] font-black uppercase">
                        Successful
                      </span>
                    </div>
                    <div className="pt-0.5">
                      <span className="text-[6.5px] text-slate-500 font-bold block uppercase">Amount</span>
                      <p className="text-[10px] font-black text-slate-950 font-mono">₦57,000.00</p>
                    </div>
                  </div>
                  <div className="p-1 flex items-center justify-between bg-[#182229] text-[8px]">
                    <div className="flex items-center gap-1 truncate">
                      <FileText className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                      <span className="truncate text-white">TransferReceipt-43.pdf</span>
                    </div>
                    <span className="text-[#8696a0] shrink-0">12:44 PM</span>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-xs bg-[#202c33] text-[#e9edef] px-1.5 py-0.5">
                  <p className="text-[9px] font-medium text-emerald-400">
                    Send to Abuja: <span className="text-white">Engr Felix</span> <span className="font-mono underline text-white">07040161507</span>
                  </p>
                </div>
              </div>

              {/* Dispatched parcel box (reduced height: h-9) */}
              <div className="flex justify-end">
                <div className="max-w-[88%] rounded-lg rounded-tr-xs bg-[#005c4b] text-[#e9edef] p-1 space-y-0.5">
                  <div className="w-full h-9 bg-[#11161a] rounded flex items-center justify-center p-0.5">
                    <div className="bg-white text-slate-950 rounded px-1 py-0.5 text-center font-mono text-[7px] shadow w-full">
                      <p className="font-black border-b border-slate-200 text-[6px]">UTAKO PARK, ABUJA</p>
                      <p className="font-black text-[7px]">ENGR. FELIX 07040161507</p>
                    </div>
                  </div>
                  <div className="px-0.5 text-[9px]">
                    <p className="font-semibold text-white">Good morning Sir</p>
                    <div className="flex items-baseline justify-between text-[8px]">
                      <span className="text-emerald-100">Your payment is received</span>
                      <CheckCheck className="w-2 h-2 text-[#53bdeb]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="bg-[#121b22] px-2 py-1 flex items-center gap-1 border-t border-white/5 text-[#8696a0]">
              <div className="flex-1 bg-[#202c33] rounded-full px-2 py-0.5 flex items-center justify-between text-[9px]">
                <span>Message</span>
                <Camera className="w-2.5 h-2.5" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Paid Amount</span>
              <p className="font-black text-slate-900">₦57,000.00</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Bank</span>
              <p className="font-black text-purple-700">Kuda Bank PDF</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Recipient</span>
              <p className="font-mono font-bold text-slate-800">07040161507</p>
            </div>
            <div className="p-1.5 rounded-md bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[7.5px] uppercase">Destination</span>
              <p className="font-bold text-slate-800">Utako Park, Abuja</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              onClick={handleOrderClick}
              className="flex-1 py-1.5 btn-3d-yellow text-slate-950 font-black text-[10px] rounded-md shadow-2xs flex items-center justify-center gap-1"
            >
              <PackageCheck className="w-3 h-3" />
              <span>ORDER 10 JARS</span>
            </button>
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20saw%20Engr%20Felix%27s%20review%20and%20I%20want%20to%20order"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-[#25d366] hover:bg-[#20bd5a] text-slate-950 font-black text-[10px] rounded-md flex items-center justify-center gap-1 transition-colors shrink-0"
            >
              <MessageCircle className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>WHATSAPP</span>
            </a>
          </div>

        </div>

      </div>

      {/* Trust Mini Footer */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 font-black text-emerald-950 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Guaranteed Potency & Safe Interstate Waybill Across Nigeria</span>
          </div>
          <p className="text-[10px] text-emerald-800 max-w-xl font-normal">
            Whether ordering 1 jar, 6 jars, 10 jars, or 21 jars, your parcel is packed with direct tracking and dispatched promptly.
          </p>
        </div>

        <button
          onClick={handleOrderClick}
          className="w-full sm:w-auto px-3.5 py-2 btn-3d-yellow text-slate-950 font-black text-[11px] rounded-lg shadow-2xs flex items-center justify-center gap-1 shrink-0"
        >
          <PackageCheck className="w-3 h-3" />
          <span>ORDER YOUR PACK TODAY</span>
        </button>
      </div>

    </div>
  );
};
