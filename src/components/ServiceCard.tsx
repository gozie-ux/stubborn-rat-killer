import React, { useState, useEffect } from 'react';
import { PestService } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  ShieldAlert, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Building2, 
  Flame, 
  Bug, 
  Layers, 
  ExternalLink,
  Info
} from 'lucide-react';

interface ServiceCardProps {
  service: PestService;
  onOpenDetails: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onOpenDetails }) => {
  const { generateWhatsAppServiceBookingUrl } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 2 Seconds Auto-Slide Interval
  useEffect(() => {
    if (!service.images || service.images.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % service.images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [service.images, isPaused]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    const fallbackSvg = index === 0 ? '/images/service-bedbugs-1.svg' : '/images/service-bedbugs-2.svg';
    if (e.currentTarget.src !== fallbackSvg) {
      e.currentTarget.src = fallbackSvg;
    }
  };

  const whatsappDirectUrl = generateWhatsAppServiceBookingUrl(service);

  return (
    <div 
      id={`service-card-${service.id}`}
      className="bg-neutral-950 border-2 border-red-600/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.25)] hover:border-red-500 hover:shadow-[0_25px_60px_rgba(239,68,68,0.4)] transition-all duration-300 flex flex-col group"
    >
      {/* Top Gold & Red Badge Header */}
      <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-black p-4 sm:p-5 border-b border-red-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-red-600 text-white font-black text-xs sm:text-sm rounded-xl tracking-wider uppercase shadow-[0_4px_12px_rgba(220,38,38,0.6)] font-mono flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
            SERVICE #{service.serviceNumber}
          </span>
          <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold text-[11px] sm:text-xs rounded-xl flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {service.badge}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono font-bold">
          <Building2 className="w-4 h-4 text-yellow-400" />
          <span className="text-white">{service.companyName}</span>
        </div>
      </div>

      {/* Main Grid: Media & High-Impact Copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7">
        {/* Left Visual Gallery (5 Cols) with 2-Second Auto-Slide */}
        <div 
          className="lg:col-span-5 flex flex-col gap-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-black border-2 border-neutral-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] group-hover:border-red-500/60 transition-colors">
            {service.images.map((imgSrc, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeImageIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img 
                  src={imgSrc || '/images/service-bedbugs-1.svg'}
                  alt={`${service.name} slide ${idx + 1}`}
                  onError={(e) => handleImageError(e, idx)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}

            {/* Overlay Watermark Badge */}
            <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-red-500/60 px-3 py-1.5 rounded-xl flex items-center gap-2 z-20">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-black text-white tracking-wide uppercase">
                {activeImageIndex === 0 ? 'Official 3D Service Shield' : 'Heavy Industrial Fogging'}
              </span>
            </div>

            {/* Auto-Slide 2s Indicator Dots & Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700 z-20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
              {service.images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveImageIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImageIndex === dotIdx 
                      ? 'w-5 bg-yellow-400' 
                      : 'w-1.5 bg-neutral-600 hover:bg-neutral-400'
                  }`}
                  title={`Slide ${dotIdx + 1}`}
                />
              ))}
              <span className="text-[9px] font-mono text-neutral-400 ml-1">2s slide</span>
            </div>

            {/* Bottom Floating Phone Hotline */}
            <div className="absolute bottom-3 right-3 bg-red-950/90 backdrop-blur-md border border-red-500/60 px-3 py-1 rounded-xl text-[11px] font-mono font-black text-yellow-300 z-20">
              📞 {service.phone}
            </div>
          </div>



          {/* Quick Hotline Quick Call Strip */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                Call Us Directly
              </div>
              <a 
                href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                className="text-base font-black text-yellow-400 font-mono hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-green-400" />
                {service.phone}
              </a>
            </div>
            <a
              href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
              className="px-3.5 py-2 btn-3d-red text-white text-xs font-black rounded-xl shrink-0"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Right Content & Operational Rules (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            {/* Service Name & Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit'] group-hover:text-yellow-400 transition-colors">
                  {service.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-red-400 font-mono">
                {service.headline}
              </p>
            </div>

            {/* CRITICAL 3-DAY MANDATORY REQUIREMENT BOX (High-contrast yellow/red banner) */}
            <div className="mt-4 bg-gradient-to-r from-red-950/90 to-neutral-900 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-[0_10px_25px_rgba(220,38,38,0.3)] space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-sm sm:text-base font-black text-yellow-300 tracking-wide">
                    ⚠️ IMPORTANT RULE:
                  </h4>
                  <p className="text-xs sm:text-sm font-black text-white mt-1 leading-relaxed">
                    "{service.requirementNotice}"
                  </p>
                </div>
              </div>

              {/* WHY 3 DAYS EXPLANATION */}
              <div className="bg-black/60 rounded-xl p-3.5 border border-red-500/40 text-xs sm:text-sm text-neutral-200 space-y-2">
                <div className="font-black text-yellow-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-400" />
                  {service.whyNotice}
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {service.whyExplanation}
                </p>
                <div className="pt-1.5 border-t border-neutral-800 text-[11px] font-bold text-red-300 italic">
                  "{service.yearsEmbarrassingNotice}"
                </div>
              </div>
            </div>

            {/* 3-Day Example Timeline Badge */}
            <div className="mt-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-yellow-400 uppercase tracking-wider font-mono">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span>How Your 3-Day Schedule Works:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Step 1: Friday */}
                <div className="bg-black border border-neutral-800 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase bg-red-950/80 px-2 py-0.5 rounded">
                    DAY 1 • FRIDAY
                  </span>
                  <div className="text-xs font-black text-white">Smoking the House</div>
                  <div className="text-[11px] text-neutral-400">Leave the house</div>
                </div>

                {/* Step 2: Saturday */}
                <div className="bg-black border border-neutral-800 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase bg-yellow-950/80 px-2 py-0.5 rounded">
                    DAY 2 • SATURDAY
                  </span>
                  <div className="text-xs font-black text-white">Smoke Kills Bugs &amp; Eggs</div>
                  <div className="text-[11px] text-neutral-400">Keep doors &amp; windows closed</div>
                </div>

                {/* Step 3: Sunday */}
                <div className="bg-black border border-green-800/80 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold text-green-400 uppercase bg-green-950/80 px-2 py-0.5 rounded">
                    DAY 3 • SUNDAY (4PM)
                  </span>
                  <div className="text-xs font-black text-green-300">Return to Your House</div>
                  <div className="text-[11px] text-neutral-400">100% Free of All Bugs &amp; Eggs!</div>
                </div>
              </div>

              <p className="text-[11px] font-mono font-bold text-neutral-400 bg-black/40 p-2 rounded-lg border border-neutral-800">
                {service.scheduleExample.note}
              </p>
            </div>

            {/* Additional Pests Eliminated & Facilities List */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Also Kills */}
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-black text-red-400 flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-red-500" />
                  Also Clears Out:
                </div>
                <ul className="text-xs text-neutral-300 space-y-1 font-medium">
                  {service.additionalPestsEliminated.slice(1).map((pest, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span>{pest}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proven in Facilities */}
              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-black text-yellow-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-yellow-400" />
                  Places We Fumigate:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {service.facilitiesTreated.map((facility, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-bold bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-lg border border-neutral-800"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs: WhatsApp + Call + Full Details */}
          <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Primary WhatsApp Booking Button */}
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3.5 px-4 btn-3d-yellow text-black font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4 fill-black shrink-0" />
              <span>Book on WhatsApp</span>
            </a>

            {/* Direct Call & Details Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 sm:flex-initial py-3.5 px-4 btn-3d-red text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 text-center shrink-0"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Call Now</span>
              </a>

              <button
                onClick={() => onOpenDetails(service.id)}
                className="flex-1 sm:flex-initial py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <span>Details</span>
                <ChevronRight className="w-4 h-4 text-yellow-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
