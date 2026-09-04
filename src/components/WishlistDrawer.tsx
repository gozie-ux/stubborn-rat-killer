import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Zap, 
  Check 
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    wishlistCount,
    toggleWishlist,
    clearWishlist,
    moveAllWishlistToCart,
    isWishlistDrawerOpen,
    setIsWishlistDrawerOpen,
    addToCart,
    formatPrice,
    setSelectedProductId,
    setIsProductModalOpen
  } = useStore();

  if (!isWishlistDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div 
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-neutral-950 border-l-2 border-yellow-500/40 text-neutral-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Hazard top */}
        <div className="h-1.5 w-full hazard-stripes" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-neutral-900 flex items-center justify-between bg-black/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-yellow-300 shadow-[0_3px_0_#991b1b]">
              <Heart className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-['Outfit'] tracking-wide">SAVED CHEMICALS</h2>
              <span className="text-xs text-yellow-400 font-mono font-bold">{wishlistCount} Formulations Watchlisted</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs text-neutral-400 hover:text-red-500 font-bold transition-colors px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="w-9 h-9 rounded-xl btn-3d-black flex items-center justify-center text-neutral-300 hover:text-white"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-black border-2 border-neutral-800 flex items-center justify-center text-red-500">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Your Saved Wishlist is Empty</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs font-medium">
                  Tap the heart icon on any chemical or equipment product to bookmark it for rapid dispatch ordering.
                </p>
              </div>
              <button
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="px-6 py-3 btn-3d-yellow text-black font-black text-xs rounded-2xl"
              >
                Explore High Potency Catalog
              </button>
            </div>
          ) : (
            wishlist.map((item) => {
              const p = item.product;
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-black border-2 border-neutral-800 flex gap-3.5 items-center group relative hover:border-yellow-500/50 transition-all card-3d"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 object-contain p-1 bg-neutral-900 rounded-xl border border-neutral-800 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setIsProductModalOpen(true);
                      setIsWishlistDrawerOpen(false);
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setIsProductModalOpen(true);
                          setIsWishlistDrawerOpen(false);
                        }}
                        className="text-xs font-black text-white truncate group-hover:text-yellow-400 cursor-pointer"
                      >
                        {p.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(p)}
                        className="text-neutral-500 hover:text-red-500 p-1 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] text-neutral-400 font-bold block mt-0.5">
                      Target: {p.targetPests.join(', ')}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-yellow-400 font-mono">
                        {formatPrice(p.price)}
                      </span>

                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={p.stock <= 0}
                        className="px-3 py-1.5 btn-3d-yellow text-black text-[10px] font-black rounded-xl flex items-center gap-1 disabled:opacity-40"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {wishlist.length > 0 && (
          <div className="p-4 sm:p-5 border-t-2 border-neutral-900 bg-black/90 space-y-2">
            <button
              onClick={moveAllWishlistToCart}
              id="wishlist-move-all-btn"
              className="w-full py-3.5 px-4 rounded-2xl btn-3d-yellow text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Move All In-Stock to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
