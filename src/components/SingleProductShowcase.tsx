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
      name: '1 Bottle (Small Flat / Shop)',
      qty: 1,
      price: product.price, // 5800
      originalPrice: product.originalPrice, // 7500
      discount: '23% OFF',
      bestFor: '1 - 2 Room Flat or Small Shop',
      bonus: 'Includes 1x Free Measuring Spoon',
      tag: '1 BOTTLE'
    },
    {
      id: 'double' as const,
      name: '2 Bottles (Big House / Duplex)',
      qty: 2,
      price: 11000, // 5500 per jar (save ₦600)
      originalPrice: 15000,
      discount: 'SAVE ₦4,000',
      bestFor: '3 - 5 Bedroom House or Office',
      bonus: 'Includes 2x Free Measuring Spoons',
      tag: '🔥 MOST POPULAR',
      recommended: true
    },
    {
      id: 'triple' as const,
      name: '3 Bottles (Poultry Farm, Store or Warehouse)',
      qty: 3,
      price: 16000, // 5333 per jar (save ₦1,400)
      originalPrice: 22500,
      discount: 'SAVE ₦6,500',
      bestFor: 'Poultry Farms, Stores & Big Compounds',
      bonus: 'Includes 3x Free Spoons + Quick Delivery',
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
      a: 'It kills any rat or mouse within 45 minutes to 2 hours after they eat the powder. This has been tested and confirmed in homes, shops, and poultry farms.'
    },
    {
      q: 'What if the rats in my house refused to die with other market poisons?',
      a: 'Most ordinary market poisons are too weak because rats are now used to them. Stubborn Rat Killer is very strong. Even big gutter rats that survived other poisons will die once they eat this.'
    },
    {
      q: 'Will the rats agree to eat it?',
      a: 'Yes! The powder smells very sweet to rats, so they eat it happily without suspecting anything. Once they eat it, they die quickly.'
    },
    {
      q: 'How many spoons should I put down, and what time is best?',
      a: 'Rats move around at night in the dark. For best results, use the free spoon inside the bottle to put one full spoon on small pieces of paper or carton in dark wall corners between 5:00 PM and 7:00 PM in the evening.'
    },
    {
      q: 'How does delivery work across Nigeria?',
      a: 'We send packages every day from our office in Ikeja, Lagos. Lagos orders arrive same-day or next day. For Abuja, Port Harcourt, Ibadan, Kano, and other states, it takes 1 to 2 days.'
    },
    {
      q: 'How do I pay?',
      a: 'You can pay online with bank transfer or debit card. You can also chat with us directly on WhatsApp (+234 808 985 4753) to pay by normal bank transfer.'
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
                <span className="text-slate-200 text-xs font-mono">
                  {selectedImageIndex + 1}/{product.images.length}
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
                  FREE MEASURING SPOON INCLUDED
                </span>
                <p className="text-slate-700 mt-0.5 font-normal">
                  Every bottle comes with a free spoon inside. You never have to touch the poison with your bare hands.
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
                  ORIGINAL NIGERIAN RAT KILLER
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-black">5.0</span>
                  <span className="text-slate-600 font-medium">({product.reviewCount} Happy Customer Reviews)</span>
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
                <span>Dead in 45 Mins – 2 Hours</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kills Even Stubborn Rats</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kills on First Eating</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Big Gutter Rats & Mice</span>
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
                Price: <strong className="text-slate-900">{formatPrice(unitPrice)}</strong> for {currentPackData.name}.
              </p>
            </div>

            {/* Bundle Pack Selector (1 Jar, 2 Jars, 3 Jars) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Choose Your Pack:
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
                <span>BUY ON WHATSAPP (+234 808 985 4753)</span>
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
                        Do You Prefer Buying on Jiji?
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block">
                        You can also buy safely from our official verified Jiji store
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
                        Official Jiji Store
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
                <span className="font-semibold text-slate-800">Fast Delivery Nationwide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Safe & Easy Payment</span>
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
            WHY ORDINARY RAT POISONS FAIL
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
            Why Stubborn Rat Killer Works When Other Market Poisons Fail
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Rats in Nigeria have become used to weak market poisons and do not die from them anymore.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3.5 text-slate-600 font-black uppercase">What You Need</th>
                <th className="p-3.5 text-amber-900 font-black uppercase bg-amber-50 border-x border-amber-200 rounded-t-xl">
                  ⚡ STUBBORN RAT KILLER
                </th>
                <th className="p-3.5 text-slate-500 font-black uppercase">Ordinary Market Poisons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">How Fast It Kills</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Kills in 45 Minutes to 2 Hours
                </td>
                <td className="p-3.5 text-slate-500">Takes 4 to 8 days or doesn't work at all</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Kills Stubborn Rats</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Kills Even Giant Gutter & Ceiling Rats
                </td>
                <td className="p-3.5 text-slate-500">Rats are used to it and eat it like free food</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Rats Agree to Eat It?</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Sweet smell makes rats eat it quickly
                </td>
                <td className="p-3.5 text-slate-500">Rats avoid it because of chemical smell</td>
              </tr>
              <tr>
                <td className="p-3.5 text-slate-900 font-bold">Free Spoon Inside?</td>
                <td className="p-3.5 text-amber-950 font-black bg-amber-50/60 border-x border-amber-200">
                  ✓ Free measuring spoon inside every bottle
                </td>
                <td className="p-3.5 text-slate-500">No spoon; you risk touching poison with your hands</td>
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
              SIMPLE 4-STEP GUIDE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
              How to Put Down the Powder in the Evening
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
              Rats move around in the dark looking for food. Follow these 4 easy steps between 5:00 PM and 7:00 PM to kill them by morning.
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono text-slate-700">
            ⏰ Best Time: <strong className="text-red-600 font-bold">5:00 PM – 7:00 PM in the Evening</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">01</span>
            <h4 className="text-sm font-black text-slate-950">Scoop One Spoon</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Open the bottle and use the free spoon inside to take one full spoon of powder.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">02</span>
            <h4 className="text-sm font-black text-slate-950">Put on Carton Paper</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Pour the scooped powder on a piece of paper or carton on the floor near the wall.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">03</span>
            <h4 className="text-sm font-black text-slate-950">Put in Dark Corners</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Place it in dark corners where you have seen rats pass (like behind the fridge, under the sink, or in the ceiling).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-amber-500 hover:shadow-md transition-all">
            <span className="text-3xl font-black text-amber-500 font-mono">04</span>
            <h4 className="text-sm font-black text-slate-950">Wake Up to Dead Rats</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Rats eat it greedily at night and die within 45 minutes to 2 hours. You will see dead rats by morning.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Verified Nigerian Customer Reviews */}
      <div id="reviews" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 space-y-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest font-mono">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
              Real Reviews from People Across Nigeria
            </h3>
            <p className="text-xs text-slate-600 font-normal">
              Read real stories from people who used Stubborn Rat Killer to clear rats from their homes and shops.
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
                      ✓ Real Buyer
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
                Killed: {rev.pestEliminated}
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
              Delivery Time & Fee by State
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-normal">
              We send to all 36 states and Abuja. Click your state to see the delivery fee and how fast it reaches you.
            </p>
          </div>

          <div className="text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Office Location: <strong className="text-slate-900">Ikeja, Lagos</strong>
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
            COMMON QUESTIONS
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit']">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-600 font-normal">
            Everything you need to know before buying your Stubborn Rat Killer bottle.
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
            BUY IN BULK / CARTONS
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Do You Need Bulk Cartons for Poultry, Hotels, or Stores?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-normal">
            We sell full cartons (12, 24, or 48 bottles) at cheaper wholesale prices, with fast delivery to any state in Nigeria.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <a
            href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20want%20to%20buy%20in%20bulk%20cartons."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md"
          >
            <span>Ask for Bulk / Wholesale Price</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
