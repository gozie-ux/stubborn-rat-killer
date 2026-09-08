import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Heart, 
  Zap, 
  Star, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Clock, 
  Truck, 
  AlertOctagon, 
  Flame, 
  ArrowRight,
  Plus,
  Minus,
  MapPin,
  Award,
  ExternalLink
} from 'lucide-react';
import { NIGERIAN_STATES } from '../data/initialProducts';

export const SingleProductShowcase: React.FC = () => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setIsCheckoutOpen,
    generateWhatsAppOrderUrl,
    showToast
  } = useStore();

  // The single product
  const product = products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPack, setSelectedPack] = useState<'single' | 'double' | 'triple'>('single');
  const [quantity, setQuantity] = useState(1);
  const [selectedStateIndex, setSelectedStateIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 2-Second Auto Slide for product images
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [product?.images]);

  if (!product) {
    return (
      <div className="p-12 text-center text-slate-700">
        Product not found.
      </div>
    );
  }

  const isWish = isInWishlist(product.id);

  // Bundle pricing logic
  const packs = [
    {
      id: 'single' as const,
      name: '1 Jar (Standard Home Pack)',
      qty: 1,
      price: product.price, // 5800
      originalPrice: product.originalPrice, // 7500
      discount: '23% OFF',
      bestFor: '1 - 2 Bedroom Flat / Shop',
      bonus: 'Includes 1x Free Dosing Scoop Spoon',
      tag: 'STANDARD'
    },
    {
      id: 'double' as const,
      name: '2 Jars (Duplex & Compound Pack)',
      qty: 2,
      price: 11000, // 5500 per jar (save ₦600)
      originalPrice: 15000,
      discount: 'SAVE ₦4,000',
      bestFor: '3 - 5 Bedroom Duplex / Office Block',
      bonus: 'Includes 2x Free Precision Scoops',
      tag: '🔥 MOST POPULAR',
      recommended: true
    },
    {
      id: 'triple' as const,
      name: '3 Jars (Master Farm & Warehouse Pack)',
      qty: 3,
      price: 16000, // 5333 per jar (save ₦1,400)
      originalPrice: 22500,
      discount: 'SAVE ₦6,500',
      bestFor: 'Poultry Farms, Warehouses & Estates',
      bonus: 'Includes 3x Free Scoops + Priority Waybill Dispatch',
      tag: 'BEST VALUE'
    }
  ];

  const currentPackData = packs.find((p) => p.id === selectedPack) || packs[0];
  const unitPrice = currentPackData.price;
  const totalPrice = unitPrice * quantity;
  const totalItemsCount = currentPackData.qty * quantity;

  const handlePackSelect = (packId: 'single' | 'double' | 'triple') => {
    setSelectedPack(packId);
  };

  const handleAddToCart = () => {
    addToCart(product, totalItemsCount);
  };

  const handleInstantBuyNow = () => {
    addToCart(product, totalItemsCount);
    setIsCheckoutOpen(true);
  };

  const handleDirectWhatsAppOrder = () => {
    const selectedState = NIGERIAN_STATES[selectedStateIndex]?.name || 'Lagos';
    const items = [
      {
        product: {
          ...product,
          price: unitPrice / currentPackData.qty
        },
        quantity: totalItemsCount
      }
    ];
    const url = generateWhatsAppOrderUrl(items, undefined, `${selectedState} (${currentPackData.name})`);
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: 'How fast does Stubborn Rat Killer kill rats and mice?',
      a: 'Stubborn Rat Killer is formulated as a fast-acting premix rodenticide. Any rat or mouse that ingests the bait is terminated within 45 minutes to 2 hours. This is verified across residential flats, warehouses, and poultry farms.'
    },
    {
      q: 'What if the rats in my house are immune to normal market poisons?',
      a: 'Market poisons usually rely on old anticoagulants to which urban rats have developed genetic resistance. Stubborn Rat Killer uses a high-potency synergistic attractant matrix with zero known resistance in Nigerian rats and mice.'
    },
    {
      q: 'Will the dead rats smell and rot inside my ceiling walls?',
      a: 'No! The formulation creates acute dehydration and oxygen thirst within 45 minutes, compelling the rodents to seek outdoor air and floor spaces before death. The active chemical contains drying mummification agents that dry out the carcass odorless.'
    },
    {
      q: 'How many scoops should I use and what time is best?',
      a: 'Rats and mice are nocturnal creatures and are most active in the dark. For maximum results, place one level scoop (using the free spoon included inside the jar) on pieces of cardboard paper at the darkest wall corners between 5:00 PM and 7:00 PM.'
    },
    {
      q: 'How does nationwide delivery work across Nigeria?',
      a: 'We dispatch daily from our central logistics depot in Ikeja, Lagos. Lagos orders arrive Same-Day or within 24 hours. Interstate orders (Abuja, Port Harcourt, Ibadan, Kano, etc.) arrive within 24–48 hours via registered park waybills or courier dispatch.'
    },
    {
      q: 'How do I make payment?',
      a: 'You can pay instantly online using Moniepoint Direct Bank Transfer, Debit Card, or USSD via our secure checkout. You can also place your order directly on WhatsApp (+234 808 985 4753) for manual bank transfer confirmation.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* 1. Main Direct Product Presentation */}
      <div id="product-overview" className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          
          {/* Left Column: Product Gallery & 2-Second Auto-Slide */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-slate-50 border-2 border-slate-200 overflow-hidden shadow-md flex items-center justify-center group">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {product.badge}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 backdrop-blur border border-slate-200 text-slate-800 font-bold text-[11px] shadow-sm">
                  <Award className="w-3 h-3 text-amber-500" />
                  Original KillAPest Formula
                </span>
              </div>

              {/* Wishlist quick action */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist toggle"
                className={`absolute top-4 right-4 z-20 p-3 rounded-2xl border transition-all shadow-sm ${
                  isWish
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white/90 backdrop-blur border-slate-200 text-slate-600 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-white' : ''}`} />
              </button>

              <img
                src={product.images[selectedImageIndex] || '/images/rat-killer-1.jpg'}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700 ease-in-out"
                referrerPolicy="no-referrer"
              />

              {/* Bottom overlay bar with kill speed & 2-second auto-slide badge */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Speed: 45 Mins – 2 Hours
                </span>
                <span className="flex items-center gap-2 text-slate-200 text-[11px]">
                  <span className="inline-flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Auto-slides 2s
                  </span>
                  <span>{selectedImageIndex + 1}/{product.images.length}</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Selectors & Auto-Slide Indicators */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-video sm:aspect-square rounded-2xl border-2 overflow-hidden transition-all relative ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-400/40 scale-[1.02] bg-white shadow-md'
                      : 'border-slate-200 bg-slate-50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-white/90 text-slate-900 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                      Jar Front
                    </span>
                  )}
                  {idx === 1 && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-white/90 text-slate-900 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                      Inside
                    </span>
                  )}
                  {idx === 2 && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-white/90 text-slate-900 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                      Bait Spoon
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Free Scoop Spoon Highlight Box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                🥄
              </div>
              <div className="text-xs">
                <span className="font-black text-slate-950 uppercase tracking-wider block">
                  FREE PRECISION SCOOP SPOON INCLUDED
                </span>
                <p className="text-slate-700 mt-0.5 font-normal">
                  Every jar arrives with a factory-calibrated measuring spoon. Never touch poison with your bare hands.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Bundle Selector, Pricing & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Header / Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider">
                  OFFICIAL NIGERIAN RAT ERADICATOR
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-black">5.0</span>
                  <span className="text-slate-600 font-medium">({product.reviewCount} Verified Eradication Reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight font-['Outfit']">
                STUBBORN RAT KILLER
              </h1>
              <p className="text-sm sm:text-base text-red-600 font-bold">
                {product.subtitle}
              </p>
            </div>

            {/* Quick Benefits Bullet Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dead in 45m – 2h</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Known Resistance</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Odorless Mummifier</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giant Sewer Rats & Mice</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit']">
                  {formatPrice(totalPrice)}
                </span>
                <span className="text-sm sm:text-base text-slate-400 line-through font-bold">
                  {formatPrice(currentPackData.originalPrice * quantity)}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-black text-xs uppercase shadow-xs">
                  {currentPackData.discount}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Unit breakdown: <strong className="text-slate-900">{formatPrice(unitPrice)}</strong> for {currentPackData.name} ({totalItemsCount} Jars total).
              </p>
            </div>

            {/* Bundle Pack Selector (1 Jar, 2 Jars, 3 Jars) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Select Your Eradication Package:
              </label>
              <div className="space-y-2.5">
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handlePackSelect(pack.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedPack === pack.id
                        ? 'bg-amber-50/80 border-amber-500 shadow-md'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPack === pack.id ? 'border-amber-500 bg-amber-500' : 'border-slate-400'
                        }`}>
                          {selectedPack === pack.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-sm font-black text-slate-900">{pack.name}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {pack.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-6 font-normal">
                        Best for: <strong className="text-slate-800 font-semibold">{pack.bestFor}</strong> • {pack.bonus}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-black text-slate-950 font-['Outfit']">
                        {formatPrice(pack.price)}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through">
                        {formatPrice(pack.originalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-slate-950 text-sm font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-600">
                Total Jars: <strong className="text-slate-950 font-black">{totalItemsCount}</strong>
              </span>
            </div>

            {/* Primary High-Converting CTAs */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Instant Checkout */}
              <button
                onClick={handleDirectWhatsAppOrder}
                id="btn-whatsapp-order"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-md hover:translate-y-[-1px] transition-all group"
              >
                <MessageCircle className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>ORDER INSTANTLY ON WHATSAPP (+234 808 985 4753)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instant Online Checkout */}
                <button
                  onClick={handleInstantBuyNow}
                  id="btn-buy-now-card"
                  className="w-full py-3.5 px-4 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>BUY NOW (ONLINE / TRANSFER)</span>
                </button>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  id="btn-add-to-cart"
                  className="w-full py-3.5 px-4 rounded-2xl btn-3d-black text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Jiji Nigeria Verified Marketplace Listings */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#3db83a] text-white flex items-center justify-center font-black text-xs shadow-xs tracking-tighter">
                      Ji
                    </span>
                    <div>
                      <span className="text-xs font-black text-slate-950 uppercase tracking-tight block">
                        Prefer to Shop on Jiji.ng?
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block">
                        Order through our verified Jiji marketplace stores with buyer protection
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
                    ✓ Jiji Verified
                  </span>
                </div>

                <div className="pt-1">
                  <a
                    href="https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Official Jiji Verified Store
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#3db83a] group-hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                      <span>Buy on Jiji</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Real-time Dispatch Guarantee Notice */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-800">24hr Nationwide Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Moniepoint Secure Payment</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Comparison: Stubborn Rat Killer vs Ordinary Supermarket Poisons */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase">
            <AlertOctagon className="w-3.5 h-3.5" />
            THE HARD TRUTH ABOUT NIGERIAN RATS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
            Why Ordinary Market Poisons Fail While Stubborn Rat Killer Wipes Them Out
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Over the past 8+ years, Nigerian urban sewer and ceiling rats have developed high genetic immunity to cheap market pellets.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3.5 text-slate-600 font-black uppercase">Feature</th>
                <th className="p-3.5 text-amber-900 font-black uppercase bg-amber-50 border-x border-amber-200 rounded-t-xl">
                  ⚡ STUBBORN RAT KILLER
                </th>
                <th className="p-3.5 text-slate-500 font-black uppercase">Ordinary Supermarket Poisons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Speed of Eradication</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Terminated in 45 Minutes to 2 Hours
                </td>
                <td className="p-3.5 text-slate-500">Takes 4 to 8 days (if they even eat it)</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Resistance Defense</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ ZERO Known Resistance (Kills Super-Rats)
                </td>
                <td className="p-3.5 text-slate-500">High resistance; rats eat it like food</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Dying Location</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Compels rodents outside into open floor / light
                </td>
                <td className="p-3.5 text-slate-500">Die inside deep ceiling rafters and cavity walls</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Odor & Decomposition</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Mummifying formula dries carcass odorless
                </td>
                <td className="p-3.5 text-slate-500">Horrible putrid smell for 2-3 weeks</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Precision Dosing Tool</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Free calibrated scoop spoon included inside
                </td>
                <td className="p-3.5 text-slate-500">No spoon; forced to use bare hands or makeshift spoons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Step-by-Step Night-Time Application Protocol */}
      <div id="how-to-use" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              NIGHT-TIME EXTERMINATION PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
              How To Apply Between 5:00 PM – 7:00 PM For 100% Morning Kill
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Rats and mice are nocturnal creatures that emerge when human activity slows down. Following this 4-step protocol guarantees total silence in the morning.
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono text-slate-700">
            ⏰ Best Window: <strong className="text-red-600 font-bold">5:00 PM – 7:00 PM</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">01</span>
            <h4 className="text-sm font-black text-slate-950">Scoop with Tool</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Open the airtight jar and take out the included free precision scoop spoon. Scoop a level spoon full of the bait.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">02</span>
            <h4 className="text-sm font-black text-slate-950">Cardboard Sheet</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Deposit the scooped bait on a piece of cardboard paper or flat carton sheet along the edge of your floor walls.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">03</span>
            <h4 className="text-sm font-black text-slate-950">Darkest Corners</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Position at the darkest corners and known rodent runways (behind fridges, kitchen cupboards, generator sheds, ceilings).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">04</span>
            <h4 className="text-sm font-black text-slate-950">Wake Up Rat-Free</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              The rats feed greedily at night and perish within 45m - 2h. Wake up to a calm, rodent-free home in the morning.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Verified Nigerian Customer Eradication Reviews */}
      <div id="reviews" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest font-mono">
              CUSTOMER TESTIMONIALS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
              Verified Eradication Proof Across Nigeria
            </h3>
            <p className="text-xs text-slate-600 font-normal">
              Real results from verified homeowners, facility managers, and farm owners.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
            <div className="text-2xl font-black text-amber-500 font-mono">5.0</div>
            <div className="text-left">
              <div className="flex text-amber-400 text-xs">★★★★★</div>
              <div className="text-[10px] text-slate-600 font-bold">100% Recommended</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left hover:border-amber-400 hover:bg-white transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-950">{rev.userName}</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      ✓ Verified Buyer
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {rev.userLocation} • <span className="text-slate-400">{rev.date}</span>
                  </span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>

              <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                Eliminated: {rev.pestEliminated}
              </div>

              <h4 className="text-sm font-bold text-slate-950">"{rev.title}"</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Nationwide Delivery Schedule & Shipping Calculator */}
      <div id="dispatch-schedule" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 font-['Outfit'] flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              Nationwide Nigeria Dispatch & Delivery Schedule
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-normal">
              We ship to all 36 states and the FCT. Check the delivery fee and estimated arrival time for your state.
            </p>
          </div>

          <div className="text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Logistics Hub: <strong className="text-slate-900">Ikeja, Lagos Depot</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {NIGERIAN_STATES.slice(0, 12).map((st, idx) => (
            <button
              key={st.name}
              onClick={() => setSelectedStateIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedStateIndex === idx
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-black text-xs">{st.name}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${selectedStateIndex === idx ? 'text-slate-950 font-bold' : 'text-amber-700 font-bold'}`}>
                {formatPrice(st.fee)}
              </div>
              <div className={`text-[10px] truncate ${selectedStateIndex === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                {st.days}
              </div>
            </button>
          ))}
        </div>

        {/* Selected State Details Card */}
        {NIGERIAN_STATES[selectedStateIndex] && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest">
                ACTIVE SELECTION
              </span>
              <div className="text-base font-black text-slate-950">
                Delivery to {NIGERIAN_STATES[selectedStateIndex].name} State: {formatPrice(NIGERIAN_STATES[selectedStateIndex].fee)}
              </div>
              <p className="text-xs text-slate-700">
                Estimated Transit Time: <strong className="text-slate-950 font-bold">{NIGERIAN_STATES[selectedStateIndex].days}</strong>
              </p>
            </div>

            <button
              onClick={handleDirectWhatsAppOrder}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shrink-0 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Dispatch to {NIGERIAN_STATES[selectedStateIndex].name}</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <div id="faqs" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-6 shadow-md">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-red-600 uppercase tracking-widest font-mono">
            QUESTIONS & ANSWERS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-600 font-normal">
            Everything you need to know before securing your Stubborn Rat Killer jar.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-slate-900 hover:text-red-600"
              >
                <span>{faq.q}</span>
                <span className="text-amber-600 text-lg font-mono">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-3 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Commercial Bulk Chemical Wholesale Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-50 via-amber-50 to-white border-2 border-red-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="h-1.5 w-full hazard-stripes absolute top-0 left-0 right-0" />

        <div className="space-y-2 text-center md:text-left z-10 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-black uppercase shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-300" />
            COMMERCIAL WHOLESALE DISPATCH
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Need Wholesale Cartons for Poultry, Hotels or Warehouses?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-normal">
            We supply bulk cartons (12, 24, or 48 Jars) at wholesale merchant distributor rates with direct interstate haulage.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <a
            href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20need%20a%20commercial%20bulk%20wholesale%20carton%20quotation."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md"
          >
            <span>Request Bulk Wholesale Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
