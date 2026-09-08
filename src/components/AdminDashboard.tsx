import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { PestCategory, ApplicationForm, ToxicityRating, OrderStatus, PaymentStatus, Product } from '../types';
import { 
  PlusCircle, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  SlidersHorizontal, 
  TrendingUp, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Upload, 
  Tag, 
  ShieldAlert, 
  ShieldCheck,
  Truck, 
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  Flame,
  Radio,
  Box,
  Lock,
  LogOut,
  KeyRound,
  Shield,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    resetToDefaultProducts,
    services,
    updateServiceImages,
    updateService,
    resetServicesToDefault,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    formatPrice,
    setActiveView,
    showToast,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPasscode
  } = useStore();

  const [adminTab, setAdminTab] = useState<'inventory' | 'post-product' | 'orders' | 'security'>('inventory');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('All');

  // Security Gate State (When locked)
  const [gatePasscode, setGatePasscode] = useState('');
  const [showGatePasscode, setShowGatePasscode] = useState(false);
  const [gateError, setGateError] = useState('');
  const [isVerifyingGate, setIsVerifyingGate] = useState(false);

  // Change Passcode Form State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeMsg, setPasscodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const getPrivateAdminUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname.replace(/\/oliver\/?$/, '') || '/';
    const cleanPath = pathname === '/' ? '' : pathname;
    return `${origin}${cleanPath}/oliver`;
  };

  const handleCopyAdminUrl = async () => {
    try {
      await navigator.clipboard.writeText(getPrivateAdminUrl());
      setHasCopiedLink(true);
      showToast('Private Admin URL copied to clipboard! Bookmark this link.', 'success');
      setTimeout(() => setHasCopiedLink(false), 3000);
    } catch {
      showToast('Could not copy automatically. Link: ' + getPrivateAdminUrl(), 'info');
    }
  };

  const returnToStorefront = () => {
    try {
      const cleanPath = window.location.pathname.replace(/\/oliver\/?$/, '') || '/';
      window.history.replaceState(null, '', cleanPath + window.location.search);
    } catch (err) {
      console.error(err);
    }
    setActiveView('shop');
  };

  const handleGateUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    if (!gatePasscode.trim()) {
      setGateError('Please enter your owner security passcode.');
      return;
    }

    setIsVerifyingGate(true);
    setTimeout(() => {
      const ok = loginAdmin(gatePasscode);
      setIsVerifyingGate(false);
      if (ok) {
        setGatePasscode('');
      } else {
        setGateError('Access Denied. Incorrect Owner Passcode.');
      }
    }, 350);
  };

  const handleChangePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMsg(null);

    if (newPasscode !== confirmPasscode) {
      setPasscodeMsg({ type: 'error', text: 'New passcode and confirmation do not match.' });
      return;
    }

    if (newPasscode.length < 4) {
      setPasscodeMsg({ type: 'error', text: 'New passcode must be at least 4 characters.' });
      return;
    }

    const res = changeAdminPasscode(currentPasscode, newPasscode);
    if (res.success) {
      setPasscodeMsg({ type: 'success', text: 'Security Passcode successfully updated!' });
      setCurrentPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
    } else {
      setPasscodeMsg({ type: 'error', text: res.message });
    }
  };

  // New Product Form State
  const [newProd, setNewProd] = useState<{
    name: string;
    subtitle: string;
    slug: string;
    category: PestCategory;
    price: number;
    originalPrice: number;
    stock: number;
    sku: string;
    knockdownSpeed: string;
    residualDuration: string;
    targetPests: string;
    formType: ApplicationForm;
    toxicityRating: ToxicityRating;
    activeIngredients: string;
    packagingSize: string;
    images: string;
    description: string;
    howToUse: string;
    safetyPrecautions: string;
    jijiUrl: string;
    badge: string;
    isFeatured: boolean;
    isBestSeller: boolean;
    isFlashSale: boolean;
  }>({
    name: '',
    subtitle: '',
    slug: '',
    category: 'Bedbugs',
    price: 12000,
    originalPrice: 15000,
    stock: 50,
    sku: 'SPK-NEW-' + Math.floor(100 + Math.random() * 900),
    knockdownSpeed: 'Deadly in 15 Minutes',
    residualDuration: 'Protects for 180 Days (6 Months)',
    targetPests: 'Bedbugs, Roaches, Fleas, Mites',
    formType: 'Micro-Encapsulated Spray',
    toxicityRating: 'Industrial / High Potency (PPE Required)',
    activeIngredients: 'Chlorfenapyr 15% + Lambda-Cyhalothrin 5%',
    packagingSize: '1 Litre Concentrated Bottle',
    images: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
    description: 'Commercial formulation designed for heavy infestations where regular market sprays have failed.',
    howToUse: 'Dilute 50ml per 1 Litre of clean water in a compression sprayer. Spray thoroughly along seams, cracks, and baseboards.',
    safetyPrecautions: 'Wear protective mask and gloves. Keep away from children and pets during application.',
    jijiUrl: '',
    badge: '100% Death Guarantee',
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: false
  });

  // Calculate High Level Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const totalLowStock = products.filter((p) => p.stock <= 5).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'All') return true;
    return o.orderStatus === orderFilterStatus || o.paymentStatus === orderFilterStatus;
  });

  const handlePostProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.activeIngredients) {
      showToast('Please fill all required product fields', 'warning');
      return;
    }

    const targetPestsArray = newProd.targetPests
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const howToUseArray = newProd.howToUse
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const safetyArray = newProd.safetyPrecautions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesArray = newProd.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addProduct({
      name: newProd.name,
      subtitle: newProd.subtitle || `High potency commercial formulation for ${newProd.category}`,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProd.category,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || newProd.price),
      stock: Number(newProd.stock),
      sku: newProd.sku || 'SPK-' + Date.now().toString().slice(-4),
      knockdownSpeed: newProd.knockdownSpeed,
      residualDuration: newProd.residualDuration,
      targetPests: targetPestsArray.length > 0 ? targetPestsArray : [newProd.category],
      formType: newProd.formType,
      toxicityRating: newProd.toxicityRating,
      activeIngredients: newProd.activeIngredients,
      packagingSize: newProd.packagingSize,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80'],
      description: newProd.description,
      howToUse: howToUseArray.length > 0 ? howToUseArray : ['Apply according to safety label directions.'],
      safetyPrecautions: safetyArray.length > 0 ? safetyArray : ['Keep out of reach of children.'],
      jijiUrl: newProd.jijiUrl || undefined,
      badge: newProd.badge || undefined,
      isFeatured: newProd.isFeatured,
      isBestSeller: newProd.isBestSeller,
      isFlashSale: newProd.isFlashSale
    });

    setAdminTab('inventory');
  };

  const presetImages = [
    { label: 'Chemical Sprayer Bottle', url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80' },
    { label: 'Precision Syringe / Gel', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80' },
    { label: 'Industrial Jerrycan', url: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?w=800&auto=format&fit=crop&q=80' },
    { label: 'PPE Respirator Mask', url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Rodent Bait Station', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80' },
    { label: 'Subterranean Timber', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80' }
  ];

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
        <div className="bg-neutral-950 border-2 border-red-600 rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(220,38,38,0.3)] text-center space-y-6 card-3d">
          <div className="w-16 h-16 rounded-3xl bg-red-950/80 border-2 border-red-500/60 flex items-center justify-center mx-auto text-yellow-400 shadow-inner">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full">
              RESTRICTED • OWNER ACCESS ONLY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Owner Sign In
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
              This page is only for the shop owner to see customer orders, sales, and products.
            </p>
          </div>

          <form onSubmit={handleGateUnlock} className="space-y-4 text-left max-w-sm mx-auto">
            <div>
              <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Enter Passcode</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Safe &amp; Secure</span>
              </label>

              <div className="relative">
                <input
                  type={showGatePasscode ? 'text' : 'password'}
                  value={gatePasscode}
                  onChange={(e) => {
                    setGatePasscode(e.target.value);
                    if (gateError) setGateError('');
                  }}
                  placeholder="Enter passcode..."
                  autoFocus
                  className="w-full bg-black border-2 border-neutral-800 focus:border-yellow-400 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGatePasscode(!showGatePasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  aria-label={showGatePasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showGatePasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {gateError && (
                <p className="mt-2 text-xs font-bold text-red-400 flex items-center gap-1.5 animate-in fade-in">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{gateError}</span>
                </p>
              )}
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-400 space-y-1">
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Store Owner Notice:
              </span>
              <p>
                Default Passcode: <code className="text-white font-mono bg-black px-1 py-0.5 rounded border border-neutral-700">KILLAPEST#2026</code> (or <code className="text-white font-mono bg-black px-1 py-0.5 rounded border border-neutral-700">7453</code>). You can change this passcode inside.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isVerifyingGate}
                className="w-full py-3.5 px-4 rounded-2xl btn-3d-yellow text-black font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isVerifyingGate ? (
                  <span>Checking Passcode...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Log In to Admin</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={returnToStorefront}
                className="w-full py-2.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors text-center block"
              >
                ← Back to Shop
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top 3D Admin Header */}
      <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-yellow-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-black px-2 py-0.5 rounded shadow-sm">
                OWNER PORTAL • LOGGED IN
              </span>
              <span className="text-xs text-red-500 font-mono font-bold">+234 808 985 4753 • KILLAPEST RESOURCES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-0.5">
              STUBBORN RAT KILLER • OWNER DASHBOARD
            </h1>
            <p className="text-xs text-neutral-400 font-medium">
              Manage Products, Customer Orders &amp; Deliveries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={returnToStorefront}
            className="px-4 py-2.5 btn-3d-black text-yellow-400 font-black text-xs rounded-xl flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>View Shop</span>
          </button>
          
          <button
            onClick={resetToDefaultProducts}
            className="p-2.5 btn-3d-black text-neutral-400 hover:text-white rounded-xl"
            title="Reset products to default"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2.5 btn-3d-red text-white font-black text-xs rounded-xl flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 3D KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-yellow-500/40 card-3d flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block">
              Money Received
            </span>
            <div className="text-2xl font-black text-yellow-400 font-mono mt-1">
              {formatPrice(totalRevenue)}
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block font-bold">From paid orders</span>
          </div>
          <div className="w-12 h-12 bg-black rounded-2xl border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-red-600/50 card-3d flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {orders.length}
            </div>
            <span className="text-[10px] text-red-400 mt-1 block font-black">
              {orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed').length} waiting for delivery
            </span>
          </div>
          <div className="w-12 h-12 bg-black rounded-2xl border border-red-600/40 flex items-center justify-center text-red-500 shadow-inner">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-neutral-800 card-3d flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block">
              Products in Store
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {products.length} Items
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block font-bold">Available to buy</span>
          </div>
          <div className="w-12 h-12 bg-black rounded-2xl border border-neutral-800 flex items-center justify-center text-yellow-400 shadow-inner">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-red-600 card-3d flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] font-black text-red-400 uppercase tracking-wider block">
              Low Stock Alert
            </span>
            <div className="text-2xl font-black text-red-500 font-mono mt-1 animate-pulse">
              {totalLowStock}
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block font-bold">Items with 5 or fewer left</span>
          </div>
          <div className="w-12 h-12 bg-red-950/60 rounded-2xl border border-red-600 flex items-center justify-center text-red-500 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3D Admin Navigation Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-neutral-900 pb-3 text-xs font-black">
        <button
          onClick={() => setAdminTab('inventory')}
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all ${
            adminTab === 'inventory'
              ? 'btn-3d-yellow text-black'
              : 'btn-3d-black text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('post-product')}
          id="admin-tab-post-product"
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all ${
            adminTab === 'post-product'
              ? 'btn-3d-red text-white'
              : 'btn-3d-black text-neutral-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-yellow-300" />
          <span>+ Add New Product</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          id="admin-tab-orders"
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all ${
            adminTab === 'orders'
              ? 'btn-3d-yellow text-black'
              : 'btn-3d-black text-neutral-400 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Customer Orders &amp; Deliveries ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          id="admin-tab-security"
          className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all ${
            adminTab === 'security'
              ? 'btn-3d-yellow text-black'
              : 'btn-3d-black text-neutral-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>🔐 Change Passcode</span>
        </button>
      </div>

      {/* TAB 1: Manage Inventory */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search by product name, code, or pest..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-400"
              />
              <Search className="w-4 h-4 text-yellow-400 absolute left-3.5 top-3" />
            </div>

            <button
              onClick={() => setAdminTab('post-product')}
              className="px-5 py-2.5 btn-3d-yellow text-black font-black text-xs rounded-2xl flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* 3D Products Table */}
          <div className="bg-neutral-950 border-2 border-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300 divide-y-2 divide-neutral-900">
                <thead className="bg-black text-neutral-400 uppercase font-mono text-[10px] font-black">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (NGN)</th>
                    <th className="p-4">Stock Left</th>
                    <th className="p-4">Badges &amp; Flags</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-neutral-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-black text-white text-xs">{p.name}</div>
                            <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku}</span>
                            <span className="text-[10px] text-yellow-400 font-bold block mt-0.5">{p.packagingSize}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-black text-yellow-400 border border-neutral-800 font-bold text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-black text-white text-sm">
                        {formatPrice(p.price)}
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-neutral-500 line-through block font-normal">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) => updateStock(p.id, Number(e.target.value))}
                            className={`w-16 bg-black border-2 rounded-xl px-2 py-1.5 text-center font-mono font-black text-xs ${
                              p.stock <= 5 ? 'border-red-600 text-red-500' : 'border-neutral-800 text-white'
                            }`}
                          />
                          <button
                            onClick={() => updateStock(p.id, p.stock + 10)}
                            className="px-2.5 py-1.5 btn-3d-black text-[10px] font-black rounded-lg text-yellow-400"
                            title="Add +10 units to warehouse"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {p.badge && (
                            <span className="text-[9px] bg-yellow-400 text-black font-black px-2 py-0.5 rounded shadow-sm">
                              {p.badge}
                            </span>
                          )}
                          {p.isFlashSale && (
                            <span className="text-[9px] bg-red-600 text-white font-black px-2 py-0.5 rounded shadow-sm">
                              FLASH SALE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2.5 text-neutral-500 hover:text-red-500 hover:bg-red-950/40 rounded-xl transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Post New Product Manually */}
      {adminTab === 'post-product' && (
        <form onSubmit={handlePostProduct} className="bg-neutral-950 border-2 border-yellow-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-neutral-900">
            <div>
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block">
                ADD PRODUCT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 font-['Outfit']">
                Add New Product to Store
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                Enter product details, price, and picture.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-yellow-300 font-black shadow-[0_3px_0_#991b1b]">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bedbug Killer 1 Litre"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={newProd.category}
                onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
              >
                {[
                  'Bedbugs',
                  'Cockroaches',
                  'Termites & Woodborers',
                  'Rodents & Mice',
                  'Mosquitoes & Flies',
                  'Snakes & Reptiles',
                  'Safety Equipment & Sprayers',
                  'Pet-Safe & Organic'
                ].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subtitle */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Short Description / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Fast acting killer for tough bedbugs and eggs"
                value={newProd.subtitle}
                onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Pricing & Stock */}
            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Selling Price (₦ NGN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="100"
                value={newProd.price}
                onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono font-black"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Original Price (₦ NGN)
              </label>
              <input
                type="number"
                min="100"
                value={newProd.originalPrice}
                onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                How Many in Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={newProd.stock}
                onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono font-black"
              />
            </div>

            {/* Technical Parameters */}
            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Active Ingredients <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chlorfenapyr 15% + Fipronil 0.05%"
                value={newProd.activeIngredients}
                onChange={(e) => setNewProd({ ...newProd, activeIngredients: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                How Fast It Works
              </label>
              <input
                type="text"
                placeholder="e.g. Kills in 15 Minutes"
                value={newProd.knockdownSpeed}
                onChange={(e) => setNewProd({ ...newProd, knockdownSpeed: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                How Long It Protects
              </label>
              <input
                type="text"
                placeholder="e.g. Protects for 6 Months"
                value={newProd.residualDuration}
                onChange={(e) => setNewProd({ ...newProd, residualDuration: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Target Pests */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Pests it kills (separate with commas)
              </label>
              <input
                type="text"
                placeholder="e.g. Bedbugs, Bedbug Eggs, Fleas, Ticks"
                value={newProd.targetPests}
                onChange={(e) => setNewProd({ ...newProd, targetPests: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                Bottle Size / Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 1000ml Bottle"
                value={newProd.packagingSize}
                onChange={(e) => setNewProd({ ...newProd, packagingSize: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Image URLs & Preset Selector */}
            <div className="lg:col-span-3 space-y-2">
              <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider">
                Product Image Link (or pick a picture below)
              </label>
              <input
                type="text"
                value={newProd.images}
                onChange={(e) => setNewProd({ ...newProd, images: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-neutral-500 font-bold">Presets:</span>
                {presetImages.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setNewProd({ ...newProd, images: img.url })}
                    className="text-[11px] px-3 py-1 rounded-xl bg-black hover:bg-neutral-900 text-yellow-400 border border-neutral-800 font-bold transition-colors"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jiji Shopping Link */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-black text-emerald-400 mb-1.5 uppercase tracking-wider">
                Jiji.ng Link (Optional)
              </label>
              <input
                type="url"
                placeholder="e.g. https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html"
                value={newProd.jijiUrl}
                onChange={(e) => setNewProd({ ...newProd, jijiUrl: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            {/* How to use */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
                How to Use (One step per line)
              </label>
              <textarea
                rows={3}
                value={newProd.howToUse}
                onChange={(e) => setNewProd({ ...newProd, howToUse: e.target.value })}
                className="w-full bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-neutral-900 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAdminTab('inventory')}
              className="px-5 py-3 btn-3d-black text-neutral-300 font-bold text-xs rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="admin-submit-product-btn"
              className="px-6 py-3 btn-3d-yellow text-black font-black text-xs rounded-2xl flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save &amp; Add Product</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Customer Orders & Dispatch */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="text-neutral-400">Filter Orders:</span>
              {['All', 'Confirmed', 'Dispatched', 'Delivered', 'Paid', 'Pending Verification'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl font-black transition-all ${
                    orderFilterStatus === st
                      ? 'btn-3d-yellow text-black'
                      : 'btn-3d-black text-neutral-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 border-2 border-neutral-900 rounded-3xl space-y-3 card-3d">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Truck className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-white">No Customer Orders Yet</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  When customers place an order, it will show here with their address and phone number.
                </p>
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-3xl bg-neutral-950 border-2 border-yellow-500/40 shadow-xl space-y-4 card-3d"
                >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-neutral-900 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-white text-base">
                      Order #{ord.orderNumber}
                    </span>
                    <span className="text-neutral-400">
                      Tracking: <strong className="text-yellow-400 font-mono font-black">{ord.trackingNumber}</strong>
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400 font-mono">
                      {new Date(ord.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Payment Status Dropdown */}
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => updatePaymentStatus(ord.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black focus:outline-none ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-black text-yellow-400 border-2 border-yellow-400'
                          : 'bg-red-950 text-white border-2 border-red-600'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>

                    {/* Order Dispatch Status Dropdown */}
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-black border-2 border-neutral-800 text-white px-3 py-1.5 rounded-xl text-xs font-black focus:outline-none"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <span className="font-black text-yellow-400 uppercase text-[10px] tracking-wider">Customer Name &amp; Address:</span>
                    <p className="text-white font-black">{ord.customer.fullName}</p>
                    <p className="text-neutral-300 font-mono">{ord.customer.phone} {ord.customer.email && `• ${ord.customer.email}`}</p>
                    <p className="text-neutral-400">{ord.customer.deliveryAddress}, {ord.customer.cityOrLga}, {ord.customer.state}</p>
                    {ord.customer.landmark && (
                      <p className="text-yellow-400 text-[11px] font-bold">Landmark: {ord.customer.landmark}</p>
                    )}
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-1">
                    <span className="font-black text-yellow-400 uppercase text-[10px] tracking-wider">Items Ordered ({ord.items.length}):</span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-neutral-300 bg-black p-2 rounded-xl border border-neutral-900">
                          <span className="truncate max-w-[180px] font-bold">{it.quantity}x {it.product.name}</span>
                          <span className="font-mono text-yellow-400 font-black">{formatPrice(it.product.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Total */}
                  <div className="space-y-2 bg-black p-4 rounded-2xl border-2 border-neutral-900">
                    <div className="flex justify-between text-neutral-400 text-[11px] font-bold">
                      <span>Payment Method:</span>
                      <span className="uppercase font-black text-yellow-400">{ord.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    {ord.proofOfPaymentNote && (
                      <div className="text-[11px] text-yellow-300 font-mono">
                        Note: {ord.proofOfPaymentNote}
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                      <span>Total:</span>
                      <span className="font-mono text-yellow-400 text-lg font-black">{formatPrice(ord.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* TAB 5: Owner Security & Passcode Management */}
      {adminTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-neutral-950 border-2 border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 card-3d">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-['Outfit']">
                  Change Passcode
                </h3>
                <p className="text-xs text-neutral-400">
                  Change the passcode used to open this admin page.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider mb-1.5">
                  Current Passcode
                </label>
                <input
                  type="password"
                  required
                  value={currentPasscode}
                  onChange={(e) => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="w-full bg-black border-2 border-neutral-800 focus:border-yellow-400 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider mb-1.5">
                    New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Min. 4 characters"
                    className="w-full bg-black border-2 border-neutral-800 focus:border-yellow-400 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-300 uppercase tracking-wider mb-1.5">
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Re-type new passcode"
                    className="w-full bg-black border-2 border-neutral-800 focus:border-yellow-400 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {passcodeMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    passcodeMsg.type === 'success'
                      ? 'bg-green-950/70 border-green-500/50 text-green-300'
                      : 'bg-red-950/70 border-red-500/50 text-red-300'
                  }`}
                >
                  {passcodeMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passcodeMsg.text}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3.5 btn-3d-yellow text-black font-black text-xs rounded-2xl flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update &amp; Save New Passcode</span>
                </button>
              </div>
            </form>
          </div>

          {/* Dedicated Private Admin Access URL Card */}
          <div className="bg-neutral-950 border-2 border-yellow-500/50 rounded-3xl p-6 sm:p-7 space-y-5 card-3d shadow-xl">
            <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded">
                    Hidden From Public
                  </span>
                </div>
                <h3 className="text-lg font-black text-white font-['Outfit'] mt-1">
                  Secret Admin Link
                </h3>
                <p className="text-xs text-neutral-400">
                  There is no visible admin button on the website. Bookmark this link to visit your admin page.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-yellow-400 uppercase tracking-wider">
                Your Admin Link
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex-1 bg-black border-2 border-neutral-800 rounded-2xl px-4 py-3 text-xs text-neutral-200 font-mono flex items-center overflow-x-auto select-all">
                  {typeof window !== 'undefined' ? getPrivateAdminUrl() : 'https://yourwebsite.com/oliver'}
                </div>
                <button
                  type="button"
                  onClick={handleCopyAdminUrl}
                  className="px-5 py-3 btn-3d-yellow text-black font-black text-xs rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  {hasCopiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-900" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Secret Link</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500">
                Tip: Save this link on your phone or computer so you can easily open your admin page anytime.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-white block">Secret Keyboard Shortcut</span>
                <span className="text-[11px] text-neutral-400">Press these keys on your computer to open this admin page</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-black bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-xl text-yellow-400">
                <span>Ctrl</span> + <span>Shift</span> + <span>A</span>
              </div>
            </div>
          </div>

          {/* Security Protocols Card */}
          <div className="bg-neutral-950 border-2 border-neutral-800 rounded-3xl p-6 space-y-4 card-3d">
            <div className="flex items-center gap-2 text-xs font-black text-yellow-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Owner Protection</span>
            </div>

            <ul className="space-y-2.5 text-xs text-neutral-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span><strong>Visitor Protection:</strong> Regular visitors cannot see or open your admin page or customer records.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span><strong>Instant Log Out:</strong> Clicking "Log Out" locks the admin page immediately.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span><strong>WhatsApp Notification:</strong> Orders placed on the website are also sent directly to your WhatsApp <code className="text-yellow-400 font-mono font-bold">+234 808 985 4753</code>.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

