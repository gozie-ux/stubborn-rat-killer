import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Bug, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  AlertTriangle, 
  ShieldAlert, 
  ShoppingCart, 
  RotateCcw 
} from 'lucide-react';
import { Product } from '../types';

export const PestAdvisorModal: React.FC = () => {
  const {
    isAdvisorOpen,
    setIsAdvisorOpen,
    products,
    addToCart,
    setSelectedProductId,
    setIsProductModalOpen,
    formatPrice
  } = useStore();

  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [infestationLevel, setInfestationLevel] = useState<'mild' | 'severe'>('severe');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'farm'>('residential');
  const [customDescription, setCustomDescription] = useState('');

  if (!isAdvisorOpen) return null;

  const symptomPresets = [
    {
      id: 'bedbugs',
      icon: '🛏️',
      title: 'Itchy bites on your body when you wake up + black dirt on your mattress',
      pest: 'Bedbugs',
      recommendedId: 'spk-001',
      severity: 'Biting You in Bed',
      advice: 'Ordinary market sprays do not kill bedbugs because bedbugs and their eggs hide deep inside cracks. You need a strong bedbug spray that kills both adult bugs and their eggs.'
    },
    {
      id: 'roaches',
      icon: '🪳',
      title: 'Small cockroaches running inside kitchen sockets, microwaves & cupboards',
      pest: 'Small Kitchen Cockroaches',
      recommendedId: 'spk-002',
      severity: 'Living Inside Sockets & Cupboards',
      advice: 'Spraying liquid chemicals on electrical appliances can spoil them. Use cockroach gel bait dots instead. Cockroaches eat the gel, carry it to their nest, and all of them die.'
    },
    {
      id: 'termites',
      icon: '🪵',
      title: 'Mud lines on walls, wood powder on floor & hollow ceiling wood',
      pest: 'Termites',
      recommendedId: 'spk-003',
      severity: 'Eating Wood & Walls',
      advice: 'Termites eat your doors and ceiling wood from the inside until it breaks. You need a strong termite poison that workers carry back to kill the queen termite.'
    },
    {
      id: 'rats',
      icon: '🐀',
      title: 'Scratching noise in ceiling, chewed clothes/food & black rat poop',
      pest: 'Stubborn Rats & Mice',
      recommendedId: 'spk-rat-001',
      severity: 'Rats Damaging Property',
      advice: 'Ordinary market poisons do not work because rats are now used to them. Use STUBBORN RAT KILLER powder. Put it in dark wall corners between 5:00 PM and 7:00 PM in the evening. Rats eat it greedily and die within 45 minutes to 2 hours.'
    },
    {
      id: 'snakes',
      icon: '🐍',
      title: 'Bushy compound with snakes, scorpions or dangerous crawling insects',
      pest: 'Snakes & Scorpions',
      recommendedId: 'spk-rat-001',
      severity: 'Crawling Around Compound',
      advice: 'Pour repellent powder or granules around your fence, doors, and compound edges to stop snakes and scorpions from crawling into your compound.'
    }
  ];

  const currentMatch = selectedSymptom
    ? symptomPresets.find((s) => s.id === selectedSymptom)
    : null;

  const recommendedProduct: Product | undefined = currentMatch
    ? products.find((p) => p.id === currentMatch.recommendedId) || products[0]
    : undefined;

  const handleInspect = () => {
    if (recommendedProduct) {
      setSelectedProductId(recommendedProduct.id);
      setIsProductModalOpen(true);
      setIsAdvisorOpen(false);
    }
  };

  const handleAddDirect = () => {
    if (recommendedProduct) {
      addToCart(recommendedProduct, 1);
      setIsAdvisorOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        id="pest-advisor-modal"
        className="relative bg-neutral-950 border-2 border-yellow-500/50 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-neutral-100 flex flex-col card-3d overflow-hidden"
      >
        {/* Top Hazard Line */}
        <div className="h-2 w-full hazard-stripes" />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-2 border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-yellow-300 shadow-[0_3px_0_#991b1b]">
              <Sparkles className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-['Outfit'] tracking-wide">
                PEST HELP & PRODUCT GUIDE
              </h2>
              <span className="text-xs text-yellow-400 font-mono font-bold">Tell us what pest is disturbing you to find the right solution</span>
            </div>
          </div>

          <button
            onClick={() => setIsAdvisorOpen(false)}
            className="w-9 h-9 rounded-xl btn-3d-black flex items-center justify-center text-neutral-300 hover:text-white"
            aria-label="Close advisor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisor Body */}
        <div className="p-6 space-y-6">
          {!selectedSymptom ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black text-yellow-400 uppercase tracking-widest font-['Outfit']">
                  STEP 1: WHAT PROBLEM ARE YOU SEEING?
                </h3>
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  Click on the problem you have in your house or shop:
                </p>
              </div>

              <div className="space-y-3">
                {symptomPresets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSymptom(s.id)}
                    className="w-full p-4 rounded-2xl bg-black border-2 border-neutral-800 hover:border-yellow-400 transition-all text-left flex items-center gap-4 group card-3d"
                  >
                    <span className="text-3xl shrink-0 p-2 bg-neutral-900 border border-neutral-800 rounded-2xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white group-hover:text-yellow-400">
                          {s.pest}
                        </span>
                        <span className="text-[10px] bg-red-600 text-yellow-300 px-2 py-0.5 rounded-lg font-black uppercase shadow-[0_2px_0_#991b1b]">
                          Kills Fast
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-1 leading-snug font-medium">
                        {s.title}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3">
              {/* Diagnosis Header */}
              <div className="p-5 rounded-2xl bg-red-950/60 border-2 border-red-600/70 space-y-2 card-3d">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1.5 font-['Outfit']">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                    Problem Identified: {currentMatch?.pest}
                  </span>
                  <button
                    onClick={() => setSelectedSymptom(null)}
                    className="text-xs text-neutral-300 hover:text-white font-bold flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3 h-3" /> Choose Another Problem
                  </button>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                  {currentMatch?.advice}
                </p>
              </div>

              {/* Matched Product Card */}
              {recommendedProduct && (
                <div className="p-5 rounded-2xl bg-black border-2 border-neutral-800 space-y-4 card-3d">
                  <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block font-['Outfit']">
                    BEST PRODUCT FOR YOU:
                  </span>

                  <div className="flex gap-4 items-center">
                    <img
                      src={recommendedProduct.images[0]}
                      alt={recommendedProduct.name}
                      className="w-20 h-20 object-cover rounded-2xl border-2 border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-white">
                        {recommendedProduct.name}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5 font-medium">
                        {recommendedProduct.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-base font-black text-yellow-400 font-mono">
                          {formatPrice(recommendedProduct.price)}
                        </span>
                        <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-yellow-400" /> {recommendedProduct.knockdownSpeed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleInspect}
                      className="py-3 px-4 rounded-2xl btn-3d-black text-neutral-200 font-black text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Read Product Details</span>
                    </button>

                    <button
                      onClick={handleAddDirect}
                      className="py-3 px-4 rounded-2xl btn-3d-yellow text-black font-black text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart & Buy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
