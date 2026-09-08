import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Share2, 
  MessageCircle, 
  Plus, 
  Minus, 
  Flame,
  ChevronLeft,
  ChevronRight,
  Building,
  Award,
  Calendar,
  Moon,
  PhoneCall,
  PackageCheck,
  Check,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    isProductModalOpen,
    setIsProductModalOpen,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    generateWhatsAppOrderUrl,
    setIsCheckoutOpen,
    showToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'instructions' | 'company' | 'specs' | 'safety' | 'reviews'>('instructions');
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ name: '', location: '', rating: 5, comment: '', pest: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const product = products.find((p) => p.id === selectedProductId);

  // Auto slide modal image every 2 seconds (called unconditionally)
  useEffect(() => {
    if (!isProductModalOpen || !product || !product.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isProductModalOpen, product]);

  if (!isProductModalOpen || !product) return null;

  const isWish = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleClose = () => {
    setIsProductModalOpen(false);
    setSelectedProductId(null);
    setQuantity(1);
    setActiveImageIndex(0);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsProductModalOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      showToast('Please enter your name and feedback', 'warning');
      return;
    }
    const createdReview = {
      id: 'rev-' + Date.now(),
      userName: newReview.name,
      userLocation: newReview.location || 'Nigeria',
      rating: newReview.rating,
      date: 'Just now',
      pestEliminated: newReview.pest || product.category,
      title: 'Customer Feedback',
      comment: newReview.comment,
      verifiedPurchase: true
    };
    product.reviews.unshift(createdReview);
    product.reviewCount += 1;
    setShowReviewForm(false);
    setNewReview({ name: '', location: '', rating: 5, comment: '', pest: '' });
    showToast('Thank you! Your review has been posted.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        id="product-details-modal"
        className="relative bg-neutral-950 border-2 border-yellow-500/50 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white divide-y-2 divide-neutral-900"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-2 border-neutral-900">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="text-yellow-400 uppercase tracking-widest">{product.category}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 font-mono">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl btn-3d-black text-neutral-300 hover:text-yellow-400 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2.5 rounded-xl transition-all ${
                isWish ? 'btn-3d-red text-white' : 'btn-3d-black text-neutral-300 hover:text-red-500'
              }`}
              title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWish ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-xl btn-3d-red text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Core Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Slidable Photos Gallery */}
          <div className="md:col-span-5 space-y-4">
            <div className="w-full aspect-square bg-neutral-900/70 rounded-2xl overflow-hidden border border-neutral-800 relative shadow-inner group flex items-center justify-center p-3">
              {/* Layered smooth crossfade images */}
              {product.images.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`${product.name} - View ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-contain object-center p-3 transition-all duration-500 ease-in-out ${
                    activeImageIndex === idx ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (imgSrc.endsWith('.jpg') || imgSrc.endsWith('.jpeg') || imgSrc.endsWith('.png')) {
                      const svgAlt = imgSrc.replace(/\.(jpg|jpeg|png)$/, '.svg');
                      if (!target.src.endsWith('.svg')) {
                        target.src = svgAlt;
                        return;
                      }
                    }
                  }}
                />
              ))}
              
              {product.badge && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-black font-black text-xs px-3 py-1 rounded-lg uppercase shadow-sm z-10">
                  {product.badge}
                </span>
              )}

              {/* Slidable Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/80 hover:bg-yellow-400 text-white hover:text-black border border-neutral-700 transition-all z-10 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/80 hover:bg-yellow-400 text-white hover:text-black border border-neutral-700 transition-all z-10 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Active Slide Counter Badge with 2s Auto Indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/85 border border-neutral-800 text-[10px] font-mono font-black text-yellow-400 tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1.5 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping"></span>
                    <span>SLIDE {activeImageIndex + 1} / {product.images.length}</span>
                    <span className="text-[9px] text-neutral-400 font-sans font-bold">(2s auto)</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail switcher with slidable thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all relative bg-neutral-900 p-1 ${
                      activeImageIndex === idx 
                        ? 'border-yellow-400 scale-105 shadow-md shadow-yellow-500/30' 
                        : 'border-neutral-800 opacity-70 hover:opacity-100 hover:border-neutral-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (img.endsWith('.jpg') || img.endsWith('.jpeg') || img.endsWith('.png')) {
                          const svgAlt = img.replace(/\.(jpg|jpeg|png)$/, '.svg');
                          if (!target.src.endsWith('.svg')) {
                            target.src = svgAlt;
                            return;
                          }
                        }
                      }}
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/90 text-[8px] font-bold text-yellow-400 px-1 rounded font-mono">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* What you get on item purchase box */}
            {product.packageContents && product.packageContents.length > 0 && (
              <div className="p-4 rounded-2xl bg-neutral-900/90 border-2 border-yellow-500/40 space-y-2 text-xs shadow-md">
                <div className="flex items-center gap-2 text-yellow-400 font-black uppercase tracking-wider text-[11px]">
                  <PackageCheck className="w-4 h-4 text-yellow-400" />
                  <span>What Is Inside The Box:</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {product.packageContents.map((contentItem, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white font-bold">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-black ${
                        idx === 0 ? 'bg-red-600 text-white' : 'bg-yellow-400 text-black'
                      }`}>✓</span>
                      <span>{contentItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3D Key Specs Card */}
            <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-2.5 text-xs font-bold shadow-md">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">How Fast It Works:</span>
                <span className="text-yellow-400 flex items-center gap-1 font-mono">
                  <Zap className="w-3.5 h-3.5 fill-yellow-400" /> {product.knockdownSpeed}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Strength:</span>
                <span className="text-red-400 font-mono">100% Effective on Stubborn Rats</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Packaging Size:</span>
                <span className="text-white font-mono">{product.packagingSize}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Company:</span>
                <span className="text-yellow-300">{product.companyName || 'KILLAPEST RESOURCES'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing & Actions */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-yellow-400 text-xs font-black bg-black px-2.5 py-1 rounded-lg border border-neutral-800">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewCount} customer reviews)</span>
                </div>
                <span className="text-xs text-yellow-400 font-black bg-black px-2.5 py-1 rounded-lg border border-yellow-500/50">
                  KILLAPEST RESOURCES
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-['Outfit'] tracking-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed font-medium">
                {product.subtitle}
              </p>
            </div>

            {/* Target Pests list */}
            <div>
              <span className="text-xs font-black text-neutral-400 uppercase tracking-wider block mb-2">
                KILLS AND CLEARS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.targetPests.map((pest, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-black border border-neutral-800 text-yellow-400 text-xs font-bold shadow-sm"
                  >
                    ✓ {pest}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Fixed Price Box */}
            <div className="p-4.5 rounded-2xl bg-black border-2 border-yellow-500/40 flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
              <div>
                <span className="text-xs text-yellow-400 block mb-0.5 font-black uppercase tracking-wider">
                  Best Direct Price
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-neutral-500 line-through font-bold font-mono">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-yellow-400 font-black block">
                  {product.stock > 0 ? `● In Stock (${product.stock} available)` : '● Out of Stock'}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">Fast delivery across Nigeria</span>
              </div>
            </div>

            {/* Extermination / Application Notice Alert Banner */}
            {product.nightExterminationNotice && (
              <div className="p-4 rounded-2xl bg-neutral-900 border-2 border-yellow-500/50 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-wider">
                  <Moon className="w-4 h-4 text-yellow-400" />
                  <span>
                    {product.category.includes('Snake') || product.category.includes('Reptile')
                      ? 'How to Apply Around The House'
                      : 'Best Time to Set Bait (5pm – 7pm Evening)'}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                  {product.nightExterminationNotice}
                </p>
              </div>
            )}

            {/* Quantity Selector & 3D Order Buttons */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-neutral-300">Quantity:</span>
                <div className="flex items-center bg-black border-2 border-neutral-800 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-neutral-300 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-black text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-neutral-300 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-neutral-300 font-mono">
                  Subtotal: <strong className="text-yellow-400 font-black">{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>

              {/* 3D Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  id="modal-add-to-cart-btn"
                  className="w-full py-3.5 px-4 rounded-2xl btn-3d-black text-yellow-400 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-yellow-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  id="modal-instant-checkout-btn"
                  className="w-full py-3.5 px-4 rounded-2xl btn-3d-yellow text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp Quick Order & Call Hotline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={generateWhatsAppOrderUrl([{ product, quantity }])}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-2xl btn-3d-red text-white font-black text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-yellow-300" />
                  <span>Order on WhatsApp (+234 8089854753)</span>
                </a>

                <a
                  href="tel:+2348089854753"
                  className="w-full py-3 px-4 rounded-2xl btn-3d-black text-yellow-400 font-black text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-red-500" />
                  <span>Call Hotline: +234 808 985 4753</span>
                </a>
              </div>

              {/* Jiji Shopping Link Button for Customers who prefer buying on Jiji */}
              {product.jijiUrl && (
                <div className="p-3.5 rounded-2xl bg-neutral-950 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-[0_3px_0_#065f46] shrink-0">
                      JIJI
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">Prefer Shopping on Jiji.ng?</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          Official Listing
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Order verified {product.name} on Jiji Lekki store
                      </p>
                    </div>
                  </div>

                  <a
                    href={product.jijiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_0_#065f46] active:translate-y-1 transition-all shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy on Jiji</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 bg-black p-3.5 rounded-2xl border border-neutral-900 font-bold">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-yellow-400">Kills rats within 45m - 2h</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Clean, Safe & Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Instructions, Company & Experience, Specs, Safety, Reviews */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-neutral-900 overflow-x-auto scrollbar-none pb-3 text-xs font-black">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'instructions'
                  ? 'btn-3d-yellow text-black'
                  : 'btn-3d-black text-neutral-400 hover:text-white'
              }`}
            >
              How to Use
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'company'
                  ? 'btn-3d-yellow text-black'
                  : 'btn-3d-black text-neutral-400 hover:text-white'
              }`}
            >
              About Our Company
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'specs'
                  ? 'btn-3d-yellow text-black'
                  : 'btn-3d-black text-neutral-400 hover:text-white'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'safety'
                  ? 'btn-3d-red text-white'
                  : 'btn-3d-black text-neutral-400 hover:text-white'
              }`}
            >
              Safety Rules
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'btn-3d-yellow text-black'
                  : 'btn-3d-black text-neutral-400 hover:text-white'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">
                {product.reviews.length}
              </span>
            </button>
          </div>

          {/* Tab 1: How to use */}
          {activeTab === 'instructions' && (
            <div className="space-y-5 text-xs sm:text-sm text-neutral-300">
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 leading-relaxed text-neutral-200 font-medium">
                <p className="whitespace-pre-line">{product.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-white text-sm flex items-center gap-2 font-['Outfit']">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  How to Use:
                </h4>
                <ol className="space-y-2.5 pl-1">
                  {product.howToUse.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-black p-3.5 rounded-2xl border border-neutral-900 shadow-sm">
                      <span className="w-6 h-6 rounded-lg bg-yellow-400 text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono shadow-[0_2px_0_#ca8a04]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Purchase Package Breakdown */}
              {product.packageContents && product.packageContents.length > 0 && (
                <div className="p-4 rounded-2xl bg-black border border-yellow-500/30 space-y-2">
                  <h5 className="font-black text-yellow-400 text-xs uppercase tracking-wider">What Is Inside The Box:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-white">
                    {product.packageContents.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                        <span className={idx % 2 === 0 ? "text-red-500 font-mono" : "text-yellow-400 font-mono"}>
                          {idx + 1}.
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Company & Experience */}
          {activeTab === 'company' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase">
                    <Building className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Company Name</span>
                  </div>
                  <p className="text-base font-black text-white">{product.companyName || 'KILLAPEST RESOURCES'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase">
                    <Award className="w-3.5 h-3.5 text-red-500" />
                    <span>Work Experience</span>
                  </div>
                  <p className="text-base font-black text-yellow-400">{product.workExperience || 'Over 8 years in Nigeria'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase">
                    <Check className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Where We Serve</span>
                  </div>
                  <p className="text-sm font-black text-white">{product.serviceArea || 'Homes, Offices, Shops, Warehouses'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Treatment Frequency</span>
                  </div>
                  <p className="text-sm font-black text-white">{product.frequency || 'Every 2 Weeks'}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border-2 border-red-600/50 space-y-3">
                <h4 className="font-black text-white text-base font-['Outfit']">
                  "Just one visit from us to you, your rat nightmare is gone!"
                </h4>
                <p className="text-neutral-300 leading-relaxed font-medium">
                  For over 8 years, we have helped home owners, shop keepers, and factory owners get rid of stubborn rats and mice. We make sure rats leave your property completely.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/2348089854753?text=Hello%20Killapest%20Resources,%20I%20need%20help%20killing%20rats."
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl btn-3d-yellow text-black font-black text-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a
                    href="tel:+2348089854753"
                    className="px-5 py-2.5 rounded-xl btn-3d-black text-white font-black text-xs flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-red-500" />
                    <span>Call +234 808 985 4753</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                <span className="text-neutral-400 font-black block uppercase tracking-wider text-[10px]">Active Medicine</span>
                <p className="text-sm font-black text-white">{product.activeIngredients}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                <span className="text-neutral-400 font-black block uppercase tracking-wider text-[10px]">Type</span>
                <p className="text-sm font-black text-white">{product.formType}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                <span className="text-neutral-400 font-black block uppercase tracking-wider text-[10px]">How Fast It Kills</span>
                <p className="text-sm font-black text-yellow-400 font-mono">{product.knockdownSpeed}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-1.5">
                <span className="text-neutral-400 font-black block uppercase tracking-wider text-[10px]">Effectiveness</span>
                <p className="text-sm font-black text-red-400 font-mono">{product.residualDuration}</p>
              </div>
            </div>
          )}

          {/* Tab 4: Safety */}
          {activeTab === 'safety' && (
            <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-600/50 text-xs sm:text-sm space-y-3">
              <div className="flex items-center gap-2 text-yellow-400 font-black">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                <span className="uppercase tracking-wide">Important Safety Rules:</span>
              </div>
              <ul className="space-y-2.5 pl-4 list-disc text-neutral-200 font-medium">
                {product.safetyPrecautions.map((prec, idx) => (
                  <li key={idx} className="leading-relaxed">{prec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 5: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-white text-sm font-['Outfit']">What Customers Are Saying</h4>
                  <p className="text-xs text-neutral-400">Feedback from homes, shops and hotels across Nigeria</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 btn-3d-yellow text-black font-black text-xs rounded-xl transition-all"
                >
                  {showReviewForm ? 'Cancel' : '+ Write a Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-black border-2 border-yellow-500/40 space-y-3.5">
                  <h5 className="text-xs font-black text-white uppercase tracking-wider">Write Your Review</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name (e.g. Kolawole B.)"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City/State (e.g. Ikeja, Lagos)"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-500"
                    />
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5 Kills very fast)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5 Works well)</option>
                      <option value="3">⭐⭐⭐ (3/5 Okay)</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Tell us how quickly it killed your rats..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white h-20 placeholder:text-neutral-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 btn-3d-red text-white font-black text-xs rounded-xl"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-black border-2 border-neutral-900 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{rev.userName}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-400">{rev.userLocation}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800/40">
                        ✓ Killed: {rev.pestEliminated}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-medium">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
