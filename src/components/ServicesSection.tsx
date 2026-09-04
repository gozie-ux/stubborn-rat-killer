import React from 'react';
import { useStore } from '../context/StoreContext';
import { ServiceCard } from './ServiceCard';
import { 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Award, 
  Building2, 
  Zap, 
  Layers
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, setSelectedServiceId, setIsServiceModalOpen, generateWhatsAppServiceBookingUrl } = useStore();

  const handleOpenDetails = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsServiceModalOpen(true);
  };

  const primaryService = services[0];
  const primaryWhatsappUrl = primaryService ? generateWhatsAppServiceBookingUrl(primaryService) : '#';

  return (
    <section id="services-section" className="scroll-mt-24 space-y-8">
      {/* 3D Section Title & Red/Gold Banner */}
      <div className="bg-gradient-to-r from-red-950 via-neutral-950 to-neutral-900 border-2 border-red-600/60 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(220,38,38,0.25)] relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600/30 border border-red-500/50 rounded-2xl">
              <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                PROFESSIONAL EXTERMINATION SERVICES
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              On-Site Facility Fumigation &amp; <span className="text-yellow-400">Bedbug Eradication</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              When standard retail sprays and DIY remedies fail, our specialized team at <strong className="text-white">KILLAPEST RESOURCES</strong> deploys heavy-duty industrial thermal pulse-jet foggers to achieve complete, permanent elimination.
            </p>
          </div>

          {/* Quick Stats Pillar */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row md:flex-col gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="bg-black/70 border border-red-500/40 rounded-2xl p-3 sm:p-3.5 text-center w-full sm:min-w-[160px]">
              <div className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">3 DAYS</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-neutral-300">Strict Protocol</div>
            </div>
            <div className="bg-black/70 border border-neutral-800 rounded-2xl p-3 sm:p-3.5 text-center w-full sm:min-w-[160px]">
              <div className="text-xl sm:text-2xl font-black text-red-400 font-mono">100%</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-neutral-300">Eradication Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="space-y-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.id}
            service={service}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>

      {/* Service Highlights Trust Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase font-mono">3-Day Deep Action</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Vacate Friday, re-enter Sunday 4pm for total pest extinction.</p>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase font-mono">Ovicidal Gas Penetration</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Thermal micron-fog vaporizes bedbug eggs inside mattress seams.</p>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase font-mono">Any Facility Scale</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Apartments, student hostels, offices, buses, schools &amp; mosques.</p>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase font-mono">All Pests Wiped Out</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Simultaneously kills roaches, rats, lizards, and wall geckos.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
