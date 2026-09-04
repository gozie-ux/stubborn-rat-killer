import React from 'react';
import { Truck, Zap, ShieldCheck, Award } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const guarantees = [
    {
      icon: Zap,
      title: '45M – 2H KNOCKDOWN ACTION',
      desc: 'Formulated with high-potency fast-acting premix matrix that terminates rats within 45 mins to 2 hours.',
      color: 'text-amber-600 bg-amber-50 border border-amber-200 shadow-sm'
    },
    {
      icon: Award,
      title: 'ZERO KNOWN RODENT RESISTANCE',
      desc: 'Overcomes urban rat immunity. Wipes out giant sewer rats and roof mice that survived other poisons.',
      color: 'text-red-600 bg-red-50 border border-red-200 shadow-sm'
    },
    {
      icon: ShieldCheck,
      title: 'ODORLESS MUMMIFICATION',
      desc: 'Compels rodents into the open before death and dries carcasses odorless with zero rotting stench.',
      color: 'text-emerald-600 bg-emerald-50 border border-emerald-200 shadow-sm'
    },
    {
      icon: Truck,
      title: '24-48HR NATIONWIDE DISPATCH',
      desc: 'Daily prioritized express cargo from Ikeja Lagos depot to Abuja, Port Harcourt, and all 36 states.',
      color: 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guarantees.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-3 relative overflow-hidden group text-left"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} transition-transform group-hover:scale-105`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-wide uppercase font-['Outfit'] group-hover:text-red-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
