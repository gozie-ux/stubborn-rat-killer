import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  ShieldCheck, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    formatPrice,
    setIsCheckoutOpen,
    generateWhatsAppOrderUrl
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 35000;
  const progressToFreeShip = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white border-l border-slate-200 text-slate-900 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400" />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 font-['Outfit'] tracking-wide">YOUR CART</h2>
              <span className="text-xs text-amber-700 font-mono font-bold">{cartCount} items in order</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-500 hover:text-red-600 font-bold transition-colors px-2 py-1"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-950 shadow-xs"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="p-3.5 bg-amber-50/70 border-b border-amber-200 text-xs text-slate-700">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Truck className="w-4 h-4 text-amber-600" />
                {amountNeededForFreeShip > 0 ? (
                  <span>Add <strong className="text-red-600 font-mono">{formatPrice(amountNeededForFreeShip)}</strong> more to get Free Delivery</span>
                ) : (
                  <span className="text-emerald-700 font-black">⚡ YOU GET FREE DELIVERY ANYWHERE IN NIGERIA!</span>
                )}
              </span>
              <span className="font-black text-amber-700 font-mono">{progressToFreeShip}%</span>
            </div>
            <div className="w-full h-2 bg-amber-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
                style={{ width: `${progressToFreeShip}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">Your Cart is Empty</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs font-normal">
                  Choose how many bottles you want to get started.
                </p>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-3 btn-3d-yellow text-slate-950 font-black text-xs rounded-2xl shadow-sm"
              >
                Choose Bottle Size
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3.5 items-center group relative hover:border-amber-400 hover:bg-white transition-all shadow-xs"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain p-1 bg-white rounded-xl border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-950 truncate group-hover:text-red-600">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] text-amber-700 font-bold block">
                    {item.product.packagingSize}
                  </span>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-slate-950 font-mono">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-slate-600 hover:text-slate-950"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-slate-950 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs">
                  <div className="flex items-center gap-2 text-red-700 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied (-{formatPrice(couponDiscount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:text-red-700 font-black ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Discount code (e.g. STUBBORN10)"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl shadow-xs"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <span className="text-[11px] text-red-600 mt-1 block flex items-center gap-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-red-600 font-bold">
                  <span>Discount:</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-red-600 font-mono text-base font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                id="cart-checkout-proceed-btn"
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>GO TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={generateWhatsAppOrderUrl(cart)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
