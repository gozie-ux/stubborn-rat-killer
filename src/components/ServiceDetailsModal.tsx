import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Building2, 
  Flame, 
  Bug, 
  Send,
  Star,
  MapPin,
  Check
} from 'lucide-react';

export const ServiceDetailsModal: React.FC = () => {
  const { 
    services, 
    selectedServiceId, 
    isServiceModalOpen, 
    setIsServiceModalOpen,
    generateWhatsAppServiceBookingUrl,
    showToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Booking Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [facilityType, setFacilityType] = useState('3-Bedroom Residential Flat');
  const [preferredDate, setPreferredDate] = useState('This Coming Friday');
  const [notes, setNotes] = useState('');
  const [hasAgreedTo3Days, setHasAgreedTo3Days] = useState(false);

  if (!isServiceModalOpen) return null;

  const service = services.find((s) => s.id === selectedServiceId) || services[0];
  if (!service) return null;

  // 2-Second Auto-Slide Interval
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedTo3Days) {
      showToast('Please confirm that you can leave the house for 3 days.', 'warning');
      return;
    }

    const bookingUrl = generateWhatsAppServiceBookingUrl(service, {
      name: clientName || undefined,
      phone: clientPhone || undefined,
      location: clientLocation || undefined,
      facilityType,
      preferredDate,
      notes: notes || undefined
    });

    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp to finish your booking...', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="service-details-modal"
        className="bg-neutral-950 border-2 border-red-600/60 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_rgba(220,38,38,0.35)] relative flex flex-col my-auto"
      >
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md px-6 py-4 border-b border-red-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded-xl uppercase font-mono flex items-center gap-1.5 shadow-[0_2px_10px_rgba(220,38,38,0.5)]">
              <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
              SERVICE #{service.serviceNumber}
            </span>
            <h2 className="text-base sm:text-xl font-black text-white font-['Outfit'] truncate">
              {service.name}
            </h2>
          </div>
          <button
            onClick={() => setIsServiceModalOpen(false)}
            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Visual & Key Headline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Gallery Column with 2-Second Auto-Slide */}
            <div 
              className="md:col-span-6 space-y-3"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border-2 border-neutral-800 shadow-inner">
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
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-red-500/60 px-3 py-1 rounded-xl text-[11px] font-black text-white uppercase z-20">
                  {activeImageIndex === 0 ? 'Official 3D Service Shield' : 'Heavy Industrial Fogging'}
                </div>

                {/* 2-Second Auto-Slide Dots */}
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
              </div>


            </div>

            {/* Quick Overview & Requirement Callout */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-red-950/60 border-2 border-red-500 rounded-2xl p-4.5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-yellow-300 font-black text-xs uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 animate-bounce" />
                  IMPORTANT 3-DAY RULE
                </div>
                <p className="text-sm font-black text-white leading-relaxed">
                  "{service.requirementNotice}"
                </p>
                <div className="text-xs text-neutral-300 pt-2 border-t border-red-500/30 space-y-1.5">
                  <strong className="text-yellow-400 block">{service.whyNotice}</strong>
                  <p>{service.whyExplanation}</p>
                </div>
              </div>

              {/* Verified Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider font-mono">
                  What We Do:
                </h4>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Phone Call Button */}
              <div className="pt-2">
                <a
                  href={`tel:${service.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-3 px-4 btn-3d-red text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us: {service.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Schedule Breakdown */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              How The 3-Day Work Happens (e.g. Friday to Sunday):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-black border border-neutral-800 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono font-black text-red-400 uppercase bg-red-950 px-2 py-0.5 rounded">
                  FRIDAY MORNING
                </span>
                <h4 className="text-xs font-black text-white">1. Smoking the House</h4>
                <p className="text-[11px] text-neutral-400">
                  We close all doors and windows and fill the house with hot smoke that enters every crack and mattress.
                </p>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono font-black text-yellow-400 uppercase bg-yellow-950 px-2 py-0.5 rounded">
                  SATURDAY (ALL DAY)
                </span>
                <h4 className="text-xs font-black text-white">2. Keep It Closed</h4>
                <p className="text-[11px] text-neutral-400">
                  House stays locked all day so the smoke kills all bugs and unhatched eggs completely.
                </p>
              </div>

              <div className="bg-black border border-green-800/80 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono font-black text-green-400 uppercase bg-green-950 px-2 py-0.5 rounded">
                  SUNDAY (FROM 4:00 PM)
                </span>
                <h4 className="text-xs font-black text-green-300">3. Return Home</h4>
                <p className="text-[11px] text-neutral-400">
                  Open windows for fresh air and return. Your house is now 100% free of bugs.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Booking & Quote Form */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 border-yellow-500/50 rounded-2xl p-6 space-y-5 shadow-xl">
            <div>
              <h3 className="text-lg font-black text-white font-['Outfit'] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Book Fumigation Service on WhatsApp
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Fill in your details below to send directly to our team on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Adebayo Johnson"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Phone / WhatsApp Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0808 123 4567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Your City &amp; Address (Nigeria):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ikeja, Lagos / Wuse 2, Abuja"
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Type of Building:
                  </label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="1-2 Bedroom Apartment">1-2 Bedroom Apartment</option>
                    <option value="3-4 Bedroom Flat / Duplex">3-4 Bedroom Flat / Duplex</option>
                    <option value="Student Hostel / Boarding School">Student Hostel / Boarding School</option>
                    <option value="Corporate Office / Commercial Complex">Corporate Office / Commercial Complex</option>
                    <option value="Factory / Large Warehouse">Factory / Large Warehouse</option>
                    <option value="School Bus / Staff Commercial Bus Fleet">School Bus / Staff Commercial Bus Fleet</option>
                    <option value="Church / Mosque / Worship Center">Church / Mosque / Worship Center</option>
                    <option value="Hotel / Guest House">Hotel / Guest House</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Preferred Friday Start Date:
                  </label>
                  <select
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="This Coming Friday (Urgent)">This Coming Friday (Urgent)</option>
                    <option value="Next Week Friday">Next Week Friday</option>
                    <option value="End of the Month Friday">End of the Month Friday</option>
                    <option value="Custom Date on Discussion">Custom Date on Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Tell Us What Pests You Have:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bedbugs in master bedroom &amp; sitting room"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Mandatory Checkbox */}
              <label className="flex items-start gap-3 p-3.5 bg-red-950/40 border border-red-500/60 rounded-xl cursor-pointer hover:bg-red-950/60 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={hasAgreedTo3Days}
                  onChange={(e) => setHasAgreedTo3Days(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-black border-neutral-700"
                />
                <span className="text-xs font-bold text-neutral-200 leading-relaxed">
                  I agree that everyone will leave the house for <strong className="text-yellow-400">3 full days (Friday to Sunday 4pm)</strong> so all bugs and eggs will die.
                </span>
              </label>

              {/* Submit to WhatsApp */}
              <button
                type="submit"
                className="w-full py-4 btn-3d-yellow text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(250,204,21,0.4)]"
              >
                <MessageSquare className="w-5 h-5 fill-black" />
                <span>Send Booking on WhatsApp (+234 8089854753)</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
