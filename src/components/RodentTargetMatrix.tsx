import React from 'react';
import { AlertOctagon, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const RodentTargetMatrix: React.FC = () => {
  const { products, addToCart, setIsCheckoutOpen } = useStore();
  const product = products[0];

  const handleOrder = () => {
    if (product) {
      addToCart(product, 1);
      setIsCheckoutOpen(true);
    }
  };

  const rodentTargets = [
    { 
      name: 'Giant Sewer Rats', 
      alias: 'Cricetomys / Brown Rats', 
      icon: '🐀', 
      tag: '45m Knockdown', 
      border: 'border-red-500/40', 
      badge: 'bg-red-600 text-white' 
    },
    { 
      name: 'Ceiling & Roof Rats', 
      alias: 'Scratching in Attic / Rafters', 
      icon: '🏠', 
      tag: 'Zero Rot Smell', 
      border: 'border-amber-500/40', 
      badge: 'bg-amber-400 text-black' 
    },
    { 
      name: 'Kitchen & Store Mice', 
      alias: 'Chewing Sockets & Food', 
      icon: '🧀', 
      tag: 'Instant Death', 
      border: 'border-red-500/40', 
      badge: 'bg-red-600 text-white' 
    },
    { 
      name: 'Poultry & Farm Rodents', 
      alias: 'Feed Stealers & Disease', 
      icon: '🌾', 
      tag: 'Zero Resistance', 
      border: 'border-amber-500/40', 
      badge: 'bg-amber-400 text-black' 
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertOctagon className="w-5 h-5 fill-red-100" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight font-['Outfit']">
              LETHAL TARGET SPECIES MATRIX
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered specifically to eradicate all persistent rodent breeds in Nigerian homes, stores, and farms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-950 bg-amber-400 px-3 py-1.5 rounded-xl shadow-xs">
            100% LETHALITY GUARANTEE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rodentTargets.map((target) => (
          <button
            key={target.name}
            onClick={handleOrder}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all text-left group flex flex-col justify-between h-40 hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{target.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs ${target.badge}`}>
                {target.tag}
              </span>
            </div>
            <div>
              <span className="text-sm font-black text-slate-950 block group-hover:text-red-600 transition-colors">
                {target.name}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">{target.alias}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Protocol Banner */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Optimal Application Window: <strong className="text-slate-950 font-bold">5:00 PM – 7:00 PM</strong> (Nocturnal Baiting)</span>
        </span>
        <button
          onClick={handleOrder}
          className="text-red-600 hover:text-red-700 font-black flex items-center gap-1 cursor-pointer"
        >
          <span>Order Bait For Immediate Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
