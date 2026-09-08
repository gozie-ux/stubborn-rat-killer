import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Heart, 
  Zap, 
  Star, 
  MessageCircle, 
  Check, 
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  ExternalLink
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setIsProductModalOpen,
    formatPrice,
    generateWhatsAppOrderUrl,
    cart
  } = useStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide product images every 2 seconds
  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [product.images]);

  const isWish = isInWishlist(product.id);
  const inCart = cart.find((item) => item.product.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleOpenDetails = () => {
    setSelectedProductId(product.id);
    setIsProductModalOpen(true);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppOrderUrl([{ product, quantity: 1 }]);
    window.open(url, '_blank');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      onClick={handleOpenDetails}
      id={`product-card-${product.id}`}
      className="group relative bg-neutral-950 border-2 border-neutral-800 hover:border-yellow-400/90 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_12px_24px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_40px_rgba(234,179,8,0.2)] hover:-translate-y-2 cursor-pointer overflow-hidden"
    >
      {/* Top Media & Clean Slidable Image Container (Complete Packaging Visible) */}
      <div className="relative w-full h-48 sm:h-56 bg-neutral-900/70 rounded-2xl overflow-hidden mb-3 border border-neutral-800 group-hover:border-yellow-500/40 transition-colors flex items-center justify-center p-2 sm:p-3">
        {/* Layered smooth crossfade images with full object-contain */}
        {product.images.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`${product.name} - View ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-contain object-center p-2.5 sm:p-3 group-hover:scale-105 transition-all duration-500 ease-in-out ${
              currentImageIndex === idx
                ? 'opacity-100 scale-100 z-0'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
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

        {/* Top Badges (Discount & Feature Tag) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] tracking-wide uppercase shadow-sm border border-red-500">
              -{discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-black font-black text-[9px] uppercase shadow-sm border border-yellow-300">
              {product.badge}
            </span>
          )}
        </div>

        {/* Slidable chevrons on hover */}
        {product.images.length > 1 && (
          <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 flex items-center justify-between z-10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="p-1 rounded-lg bg-black/85 hover:bg-yellow-400 text-white hover:text-black border border-neutral-700 transition-colors shadow"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1 rounded-lg bg-black/85 hover:bg-yellow-400 text-white hover:text-black border border-neutral-700 transition-colors shadow"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Slidable Dot Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-black/80 px-2 py-0.5 rounded-full border border-neutral-800 backdrop-blur-xs">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentImageIndex === i ? 'w-3.5 bg-yellow-400' : 'w-1.5 bg-neutral-600'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-xl transition-all z-10 ${
            isWish
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-black/80 text-neutral-300 hover:text-red-500 border border-neutral-800'
          }`}
          title={isWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-yellow-400 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="text-neutral-500 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug font-['Outfit']">
            {product.name}
          </h3>

          {/* Knockdown Speed Tag */}
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-300 font-mono">
            <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
            <span className="truncate">{product.knockdownSpeed}</span>
          </div>

          {/* Subtitle / Key Mechanism */}
          <p className="text-xs text-neutral-300 line-clamp-2 mt-1 font-medium leading-relaxed">
            {product.subtitle}
          </p>

          {/* Included Items Tag */}
          {(() => {
            const packageTag = product.id === 'spk-rat-001'
              ? 'Includes 100g Bait Jar + Dosing Scoop'
              : product.id === 'spk-rat-002'
              ? 'Includes 62 Wax Blocks (½kg Pack)'
              : product.id === 'spk-snake-001'
              ? 'Includes 1 Litre Concentrate Bottle'
              : product.id === 'spk-trap-001'
              ? 'Includes 135g Adhesive Glue (Original Box)'
              : product.id === 'spk-delta-001'
              ? 'Includes 1L Bottle + Measuring Dispenser Cap'
              : product.id === 'spk-deltashi-001'
              ? 'Includes 1L 12.5g/L Bottle + Dispenser Overcap'
              : product.id === 'spk-temobi-001'
              ? 'Includes 135g Kollant Temobi Tube (Original Box)'
              : product.id === 'spk-box-001'
              ? 'Includes 1 Rodenticide Box + 1 Security Key'
              : product.packageContents && product.packageContents.length > 0
              ? `Includes ${product.packageContents[0].replace(/^\d+x\s*/, '')}`
              : product.packagingSize
              ? `Pack: ${product.packagingSize}`
              : null;

            if (!packageTag) return null;

            return (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-300 font-bold bg-neutral-900/90 px-2.5 py-1 rounded-xl border border-yellow-500/30">
                <PackageCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span className="truncate">{packageTag}</span>
              </div>
            );
          })()}

          {/* Target Pests 3D Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.targetPests.slice(0, 3).map((pest, i) => (
              <span
                key={i}
                className="text-[10px] bg-black text-neutral-200 border border-neutral-800 px-2 py-0.5 rounded-lg font-bold shadow-sm"
              >
                ✓ {pest}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Stock section */}
        <div className="pt-3 border-t-2 border-neutral-900 mt-2">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-500 line-through font-bold font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-yellow-400 font-bold bg-black px-2 py-0.5 rounded border border-yellow-500/30">
              KILLAPEST
            </span>
          </div>

          {/* Stock Level Alert */}
          <div className="flex items-center justify-between text-[11px] mb-3">
            {isOutOfStock ? (
              <span className="text-red-500 font-black flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-yellow-400 font-black flex items-center gap-1 animate-pulse">
                <Clock className="w-3.5 h-3.5" /> Only {product.stock} left in stock!
              </span>
            ) : (
              <span className="text-neutral-300 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-yellow-400" /> In Stock ({product.stock})
              </span>
            )}
            <span className="text-[10px] text-neutral-500 font-mono font-bold">SKU: {product.sku}</span>
          </div>

          {/* 3D Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) addToCart(product, 1);
              }}
              disabled={isOutOfStock}
              id={`add-cart-btn-${product.id}`}
              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700'
                  : inCart
                  ? 'btn-3d-red text-white'
                  : 'btn-3d-yellow text-black'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleWhatsAppBuy}
              id={`whatsapp-buy-btn-${product.id}`}
              className="w-full py-2.5 px-2.5 rounded-xl font-black text-xs btn-3d-black text-yellow-400 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Jiji Shopping Option */}
          {product.jijiUrl && (
            <a
              href={product.jijiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 w-full py-2 px-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Buy this product on Jiji.ng"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Buy on Jiji.ng</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
