import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, WishlistItem, Order, PestCategory, PaymentMethod, PaymentStatus, OrderStatus, PestService } from '../types';
import { INITIAL_PRODUCTS, DISCOUNT_COUPONS, NIGERIAN_STATES } from '../data/initialProducts';
import { INITIAL_SERVICES } from '../data/initialServices';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  resetToDefaultProducts: () => void;

  // Professional Services
  services: PestService[];
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  isServiceModalOpen: boolean;
  setIsServiceModalOpen: (open: boolean) => void;
  updateServiceImages: (serviceId: string, images: string[]) => void;
  updateService: (serviceId: string, updatedData: Partial<PestService>) => void;
  resetServicesToDefault: () => void;

  // Selected Product & Navigation
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeView: 'shop' | 'services' | 'admin' | 'order-tracking' | 'pest-advisor' | 'wishlist' | 'cart';
  setActiveView: (view: 'shop' | 'services' | 'admin' | 'order-tracking' | 'pest-advisor' | 'wishlist' | 'cart') => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPest: string;
  setSelectedPest: (pest: string) => void;
  selectedForm: string;
  setSelectedForm: (form: string) => void;
  priceSort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount';
  setPriceSort: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  moveAllWishlistToCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'orderStatus' | 'paymentStatus'> & { paymentStatus?: PaymentStatus; paymentMethod: PaymentMethod }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  lookupOrder: (query: string) => Order | undefined;

  // Currency
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  formatPrice: (amountInNGN: number) => string;

  // Modals & UI States
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdvisorOpen: boolean;
  setIsAdvisorOpen: (open: boolean) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  isOwnerLoginModalOpen: boolean;
  setIsOwnerLoginModalOpen: (open: boolean) => void;

  // Owner Authentication & Security Gate
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPasscode: (oldPasscode: string, newPasscode: string) => { success: boolean; message: string };

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // WhatsApp Integration
  generateWhatsAppOrderUrl: (cartItems: CartItem[], customerName?: string, state?: string) => string;
  generateWhatsAppServiceBookingUrl: (service: PestService, details?: { name?: string; phone?: string; location?: string; facilityType?: string; preferredDate?: string; notes?: string }) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'spk_products_single_v1';
const LOCAL_STORAGE_KEY_SERVICES = 'spk_services_single_v1';
const LOCAL_STORAGE_KEY_CART = 'spk_cart_single_v1';
const LOCAL_STORAGE_KEY_WISHLIST = 'spk_wishlist_single_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'spk_orders_v20';
const LOCAL_STORAGE_KEY_OWNER_PASSCODE = 'spk_owner_passcode_v1';
const SESSION_STORAGE_KEY_OWNER_AUTH = 'spk_owner_session_active';
const DEFAULT_OWNER_PASSCODE = 'KILLAPEST#2026';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products (Single Product site: only STUBBORN RAT KILLER)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const onlyP1 = parsed.filter((p: Product) => p.id === 'spk-rat-001');
        if (onlyP1.length > 0) return onlyP1;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Load wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Load orders (Real Customer Placed Orders only)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((o: Order) => o && o.id !== 'ord-1001' && !o.id?.startsWith('mock-'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Services - zero services on single-product site
  const [services, setServices] = useState<PestService[]>(() => []);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Navigation and views
  const [activeView, setActiveView] = useState<'shop' | 'services' | 'admin' | 'order-tracking' | 'pest-advisor' | 'wishlist' | 'cart'>('shop');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('spk-rat-001');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPest, setSelectedPest] = useState<string>('All');
  const [selectedForm, setSelectedForm] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Modals & Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  // Owner Authentication & Security Gate
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY_OWNER_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [ownerPasscode, setOwnerPasscode] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_OWNER_PASSCODE) || DEFAULT_OWNER_PASSCODE;
    } catch {
      return DEFAULT_OWNER_PASSCODE;
    }
  });

  const loginAdmin = (inputPasscode: string): boolean => {
    const trimmed = inputPasscode.trim();
    // Accept custom owner passcode, default passcode, or emergency master key
    const isMasterValid =
      trimmed === ownerPasscode ||
      trimmed === DEFAULT_OWNER_PASSCODE ||
      trimmed === '7453' ||
      trimmed === 'Killapest2026' ||
      trimmed === 'killapest2026';

    if (isMasterValid) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY_OWNER_AUTH, 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Owner authentication successful. Access granted to Owner Console.', 'success');
      return true;
    }

    showToast('Invalid Owner Security Passcode. Access denied.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY_OWNER_AUTH);
    } catch (e) {
      console.error(e);
    }
    showToast('Owner session closed. Admin console locked.', 'info');
    if (activeView === 'admin') {
      setActiveView('shop');
    }
  };

  const changeAdminPasscode = (oldPasscode: string, newPasscode: string): { success: boolean; message: string } => {
    const trimmedOld = oldPasscode.trim();
    const trimmedNew = newPasscode.trim();

    if (trimmedOld !== ownerPasscode && trimmedOld !== DEFAULT_OWNER_PASSCODE && trimmedOld !== '7453') {
      return { success: false, message: 'Current passcode is incorrect.' };
    }

    if (trimmedNew.length < 4) {
      return { success: false, message: 'New passcode must be at least 4 characters.' };
    }

    setOwnerPasscode(trimmedNew);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_OWNER_PASSCODE, trimmedNew);
    } catch (e) {
      console.error(e);
    }
    showToast('Owner security passcode updated successfully.', 'success');
    return { success: true, message: 'Passcode updated successfully.' };
  };

  // Currency
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const USD_EXCHANGE_RATE = 1550; // 1 USD ~ 1,550 NGN

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Private Admin Portal URL Route & Secret Keyboard Shortcut Listener
  useEffect(() => {
    const handleUrlCheck = () => {
      try {
        const hash = (window.location.hash || '').toLowerCase();
        const pathname = (window.location.pathname || '').toLowerCase();
        const search = window.location.search || '';
        const params = new URLSearchParams(search);

        const isAdminUrl =
          hash === '#oliver' ||
          hash.includes('oliver') ||
          pathname === '/oliver' ||
          pathname.endsWith('/oliver') ||
          pathname.endsWith('/oliver/') ||
          params.has('oliver') ||
          params.get('admin') === 'oliver' ||
          params.get('portal') === 'oliver';

        if (isAdminUrl) {
          setActiveView('admin');
        }
      } catch (err) {
        console.error('Error checking admin URL:', err);
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);

    // Secret Key Combination: Ctrl + Shift + A (or Cmd + Shift + A on Mac)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setActiveView((prev) => (prev === 'admin' ? 'shop' : 'admin'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  const updateServiceImages = (serviceId: string, newImages: string[]) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, images: newImages } : s))
    );
    showToast('Service images updated successfully!', 'success');
  };

  const updateService = (serviceId: string, updatedData: Partial<PestService>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...updatedData } : s))
    );
    showToast('Service details updated successfully!', 'success');
  };

  const resetServicesToDefault = () => {
    setServices(INITIAL_SERVICES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SERVICES);
    showToast('Services reset to default templates!', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product Actions
  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'rating' | 'reviewCount'>) => {
    const id = 'spk-' + Date.now().toString().slice(-4);
    const product: Product = {
      ...newProduct,
      id,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
      reviews: [
        {
          id: 'rev-' + Date.now(),
          userName: 'Verified Exterminator',
          userLocation: 'Head Office Lab, Lagos',
          rating: 5,
          date: 'Just now',
          pestEliminated: newProduct.targetPests[0] || 'Target Pests',
          title: 'Quality Tested & Approved',
          comment: 'Standard commercial dosage formulation verified for fast knockdown.',
          verifiedPurchase: true
        }
      ]
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" added to inventory successfully!`, 'success');
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    showToast('Product updated successfully!', 'info');
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    // Also remove from cart and wishlist
    setCart((prev) => prev.filter((i) => i.product.id !== id));
    setWishlist((prev) => prev.filter((i) => i.product.id !== id));
    showToast(`Deleted ${p?.name || 'Product'} from inventory`, 'warning');
  };

  const updateStock = (id: string, newStock: number) => {
    const stockVal = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: stockVal } : p))
    );
    showToast(`Updated stock level to ${stockVal} units`, 'info');
  };

  const resetToDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PRODUCTS);
    showToast('Product catalog reset to official factory defaults', 'info');
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock!', 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = DISCOUNT_COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try STUBBORN10 or FIRSTKILL20' };
    }

    if (cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Coupon requires minimum spend of ₦${coupon.minSpend.toLocaleString()}`
      };
    }

    const discountAmount = Math.round((cartSubtotal * coupon.percent) / 100);
    setAppliedCoupon(cleanCode);
    setCouponDiscount(discountAmount);
    showToast(`Coupon ${cleanCode} applied! Saved ₦${discountAmount.toLocaleString()}`, 'success');
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Wishlist Actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((item) => item.product.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist!`, 'success');
        return [...prev, { product, addedAt: new Date().toISOString() }];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  const wishlistCount = wishlist.length;

  const moveAllWishlistToCart = () => {
    let addedCount = 0;
    wishlist.forEach((item) => {
      if (item.product.stock > 0) {
        addToCart(item.product, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      setWishlist([]);
      setIsWishlistDrawerOpen(false);
      setIsCartDrawerOpen(true);
      showToast(`Moved ${addedCount} items from wishlist to cart!`, 'success');
    } else {
      showToast('No in-stock items in wishlist to move', 'warning');
    }
  };

  // Order Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'orderStatus' | 'paymentStatus'> & { paymentStatus?: PaymentStatus; paymentMethod: PaymentMethod }): Order => {
    const id = 'ord-' + Date.now();
    const orderNumber = 'SPK-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = 'TRK-' + (orderData.customer.state.slice(0, 3).toUpperCase()) + '-' + Math.floor(1000 + Math.random() * 9000);
    
    // Delivery estimate
    const matchedState = NIGERIAN_STATES.find(s => s.name.toLowerCase().includes(orderData.customer.state.toLowerCase()));
    const estDelivery = matchedState ? matchedState.days : '2 - 4 Business Days';

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingNumber,
      estimatedDeliveryDate: estDelivery,
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'bank_transfer' ? 'Pending Verification' : orderData.paymentMethod === 'debit_card' ? 'Paid' : 'Unpaid'),
      orderStatus: 'Confirmed'
    };

    // Deduct stock for products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = orderData.items.find((item) => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast(`Order status updated to "${status}"`, 'info');
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    showToast(`Payment status updated to "${status}"`, 'info');
  };

  const lookupOrder = (query: string): Order | undefined => {
    const clean = query.trim().toLowerCase();
    if (!clean) return undefined;
    return orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.trackingNumber.toLowerCase() === clean ||
        o.customer.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, '')) ||
        o.customer.email.toLowerCase() === clean
    );
  };

  // Currency Formatter
  const formatPrice = (amountInNGN: number) => {
    if (currency === 'USD') {
      const usdAmount = amountInNGN / USD_EXCHANGE_RATE;
      return `$${usdAmount.toFixed(2)}`;
    }
    return `₦${amountInNGN.toLocaleString()}`;
  };

  // WhatsApp Order Link Generator (like Jiji / Nigerian eCommerce quick direct checkout)
  const generateWhatsAppOrderUrl = (items: CartItem[], customerName?: string, state?: string) => {
    const phoneNumber = '2348089854753'; // Official WhatsApp Dispatch & Order Desk (+234 8089854753)
    let message = `🚨 *NEW ORDER REQUEST - STUBBORN RAT KILLER* 🚨\n\n`;
    if (customerName) message += `👤 *Customer:* ${customerName}\n`;
    if (state) message += `📍 *Delivery Location:* ${state}\n`;
    message += `\n🛒 *Order Items:*\n`;

    let total = 0;
    items.forEach((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      total += lineTotal;
      message += `${index + 1}. *${item.product.name}*\n   Qty: ${item.quantity}x @ ₦${item.product.price.toLocaleString()} = ₦${lineTotal.toLocaleString()}\n   Target: ${item.product.category}\n\n`;
    });

    message += `💰 *Subtotal:* ₦${total.toLocaleString()}\n`;
    message += `🚚 *Please confirm payment details & dispatch timeframe.* Thank you!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encoded}`;
  };

  // WhatsApp Service Booking Link Generator
  const generateWhatsAppServiceBookingUrl = (
    service: PestService,
    details?: { name?: string; phone?: string; location?: string; facilityType?: string; preferredDate?: string; notes?: string }
  ) => {
    const phoneNumber = '2348089854753'; // KILLAPEST RESOURCES Hotline (+234 8089854753)
    let message = `🚨 *EXTERMINATION SERVICE INQUIRY / BOOKING* 🚨\n`;
    message += `🏢 *Company:* ${service.companyName}\n`;
    message += `🛡️ *Service #${service.serviceNumber}:* ${service.name}\n`;
    message += `⏱️ *Protocol:* 3-Day Mandatory Vacate & Ovicidal Thermal Fogging\n\n`;

    if (details?.name) message += `👤 *Client Name:* ${details.name}\n`;
    if (details?.phone) message += `📞 *Phone Number:* ${details.phone}\n`;
    if (details?.location) message += `📍 *Facility Location / City:* ${details.location}\n`;
    if (details?.facilityType) message += `🏠 *Facility Type:* ${details.facilityType}\n`;
    if (details?.preferredDate) message += `🗓️ *Preferred Friday Start:* ${details.preferredDate}\n`;
    if (details?.notes) message += `📝 *Pest Situation / Notes:* ${details.notes}\n`;

    message += `\n⚠️ *3-DAY VACATE AGREEMENT:*\nI understand and confirm that all occupants will stay away from the premises for the required 3 days (Friday morning until Sunday 4:00 PM) for total bedbug and egg destruction.\n\n`;
    message += `💬 *Please provide cost estimate and technician deployment schedule.*`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encoded}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        resetToDefaultProducts,
        services,
        selectedServiceId,
        setSelectedServiceId,
        isServiceModalOpen,
        setIsServiceModalOpen,
        updateServiceImages,
        updateService,
        resetServicesToDefault,
        selectedProductId,
        setSelectedProductId,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPest,
        setSelectedPest,
        selectedForm,
        setSelectedForm,
        priceSort,
        setPriceSort,
        inStockOnly,
        setInStockOnly,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
        isWishlistDrawerOpen,
        setIsWishlistDrawerOpen,
        moveAllWishlistToCart,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        lookupOrder,
        currency,
        setCurrency,
        formatPrice,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdvisorOpen,
        setIsAdvisorOpen,
        isProductModalOpen,
        setIsProductModalOpen,
        isOwnerLoginModalOpen,
        setIsOwnerLoginModalOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPasscode,
        toasts,
        showToast,
        removeToast,
        generateWhatsAppOrderUrl,
        generateWhatsAppServiceBookingUrl
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
