import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Flame, ShieldAlert, Sparkles, ArrowDown } from 'lucide-react';

export const HotDealsCarousel: React.FC = () => {
  const { 
    products, 
    services, 
    formatPrice, 
    setSelectedCategory, 
    setSelectedPest, 
    setSearchQuery, 
    setActiveView 
  } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Combine top-selling products and services
  const hotItems = [
    // Top 1 Product
    ...products.filter((p) => p.id === 'spk-rat-001').map((p) => ({
      type: 'product' as const,
      id: p.id,
      name: p.name,
      price: formatPrice(p.price),
      originalPrice: p.originalPrice > p.price ? formatPrice(p.originalPrice) : null,
      image: p.images[0] || '/images/rat-killer-1.jpg',
      badge: '🔥 HOT SELLER',
      category: p.category
    })),
    // Top Service
    ...services.slice(0, 1).map((s) => ({
      type: 'service' as const,
      id: s.id,
      name: s.name,
      price: 'Negotiable (Quote)',
      originalPrice: null,
      image: s.images[0] || '/images/service-bedbugs-1.jpg',
      badge: '⭐ TOP SERVICE',
      category: 'Fumigation Service'
    })),
    // Other top-selling products
    ...products.filter((p) => ['spk-rat-002', 'spk-snake-001', 'spk-trap-001', 'spk-delta-001', 'spk-deltashi-001', 'spk-temobi-001', 'spk-box-001'].includes(p.id)).map((p) => ({
      type: 'product' as const,
      id: p.id,
      name: p.name,
      price: formatPrice(p.price),
      originalPrice: p.originalPrice > p.price ? formatPrice(p.originalPrice) : null,
      image: p.images[0],
      badge: p.isBestSeller ? '⚡ BESTSELLER' : p.isFlashSale ? '💥 FLASH DEAL' : 'TOP PICK',
      category: p.category
    }))
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleItemClick = (item: typeof hotItems[0]) => {
    // Switch to main shop view if in admin or tracking
    setActiveView('shop');

    // Reset filters to ensure the target card is rendered in the DOM
    setSelectedCategory('All');
    setSelectedPest('All');
    setSearchQuery('');

    // Allow React state updates to render the DOM then scroll and highlight
    setTimeout(() => {
      const targetId = item.type === 'product' ? `product-card-${item.id}` : `service-card-${item.id}`;
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add a temporary pulsing highlight class
        targetElement.classList.add(
          'ring-4', 
          'ring-yellow-400', 
          'scale-[1.02]', 
          'shadow-[0_0_35px_rgba(250,204,21,0.7)]', 
          'transition-all', 
          'duration-500'
        );

        setTimeout(() => {
          targetElement.classList.remove(
            'ring-4', 
            'ring-yellow-400', 
            'scale-[1.02]', 
            'shadow-[0_0_35px_rgba(250,204,21,0.7)]'
          );
        }, 2800);
      }
    }, 150);
  };

  return (
    <section className="bg-neutral-950 border-b border-neutral-800 py-3 sm:py-4 px-3 sm:px-6 lg:px-8 overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header row with Title and Scroll Arrows */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <h2 className="text-[11px] sm:text-sm font-black tracking-wider text-yellow-400 uppercase font-mono flex items-center gap-1.5 truncate">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500 shrink-0" />
              <span className="truncate">Hot Selling Products & Services</span>
            </h2>
            <span className="hidden md:inline-block text-[11px] text-neutral-400 font-medium">
              — Tap any item to jump directly to its full details & ordering
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Strip */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-2.5 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory w-full max-w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hotItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleItemClick(item)}
              className="snap-start shrink-0 w-38 sm:w-52 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-yellow-400/80 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.8)] group select-none"
            >
              {/* Product / Service Image Box */}
              <div className="relative w-full h-28 sm:h-32 bg-black/80 rounded-xl overflow-hidden mb-2 border border-neutral-800 flex items-center justify-center p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (item.image.endsWith('.jpg') || item.image.endsWith('.jpeg') || item.image.endsWith('.png')) {
                      const svgAlt = item.image.replace(/\.(jpg|jpeg|png)$/, '.svg');
                      if (!target.src.endsWith('.svg')) {
                        target.src = svgAlt;
                      }
                    }
                  }}
                />

                {/* Subtle Mini Badge */}
                <span className="absolute top-1.5 left-1.5 text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded bg-black/85 text-yellow-300 border border-yellow-500/30">
                  {item.badge}
                </span>
              </div>

              {/* Only Name & Price */}
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight font-['Outfit']">
                  {item.name}
                </h3>

                <div className="mt-2 pt-1.5 border-t border-neutral-800 flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-1.5 truncate">
                    <span className="text-xs sm:text-sm font-black text-yellow-400 font-['Outfit'] truncate">
                      {item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-neutral-500 line-through font-mono">
                        {item.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 group-hover:text-yellow-400 flex items-center gap-0.5 shrink-0 font-bold">
                    <span>View</span>
                    <ArrowDown className="w-2.5 h-2.5 group-hover:translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
