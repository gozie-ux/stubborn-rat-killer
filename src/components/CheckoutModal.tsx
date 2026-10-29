import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { NIGERIAN_STATES } from '../data/initialProducts';
import { PaymentMethod, Order } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Truck, 
  MessageCircle, 
  Copy, 
  Check, 
  Lock, 
  ArrowRight, 
  Printer, 
  FileText, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Zap,
  Settings,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

declare global {
  interface Window {
    MonnifySDK?: {
      initialize: (options: {
        amount: number;
        currency: string;
        reference: string;
        customerName?: string;
        customerFullName?: string;
        customerEmail: string;
        customerMobileNumber?: string;
        apiKey: string;
        contractCode: string;
        paymentDescription?: string;
        isTestMode?: boolean;
        paymentMethods?: string[];
        onLoadStart?: () => void;
        onLoadComplete?: () => void;
        onComplete?: (response: {
          authorizedAmount?: number;
          paymentReference?: string;
          transactionReference?: string;
          paymentStatus: string;
          responseMessage?: string;
          paidOn?: string;
          [key: string]: unknown;
        }) => void;
        onClose?: (data?: unknown) => void;
      }) => void;
    };
  }
}

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    couponDiscount,
    appliedCoupon,
    createOrder,
    clearCart,
    formatPrice,
    showToast,
    setActiveView,
    monnifyApiKey,
    monnifyContractCode,
    setMonnifyContractCode,
    monnifyContractName,
    isMonnifyEnabled,
    isMonnifyTestMode
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Monnify Inline Contract Code Edit State
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [tempContractCode, setTempContractCode] = useState(monnifyContractCode);
  const isContractCodeLikelySecretKey = 
    monnifyContractCode.trim().length > 18 && !/^\d+$/.test(monnifyContractCode.trim());

  // Sync temp code when store changes
  useEffect(() => {
    setTempContractCode(monnifyContractCode);
  }, [monnifyContractCode]);

  // Customer Form State
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    altPhone: '',
    state: 'Lagos',
    cityOrLga: 'Ikeja',
    deliveryAddress: '',
    landmark: '',
    orderNotes: ''
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isMonnifyEnabled ? 'monnify' : 'bank_transfer');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [proofNote, setProofNote] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '5399 4100 2849 8192',
    expiry: '11/28',
    cvv: '821',
    nameOnCard: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const selectedStateObj = NIGERIAN_STATES.find((s) => s.name === customer.state) || NIGERIAN_STATES[0];
  const deliveryFee = cartSubtotal >= 35000 ? 0 : selectedStateObj.fee;
  const grandTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee);
  const totalJars = cart.reduce((acc, item) => acc + item.quantity, 0);
  const freeBonusJars = totalJars >= 5 ? 1 : 0;
  const totalDeliveredJars = totalJars + freeBonusJars;

  // Reset when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('details');
      setCompletedOrder(null);
      setIsProcessingPayment(false);
      if (isMonnifyEnabled) {
        setPaymentMethod('monnify');
      } else {
        setPaymentMethod('bank_transfer');
      }
    }
  }, [isCheckoutOpen, isMonnifyEnabled]);

  if (!isCheckoutOpen) return null;

  const handleStateChange = (newState: string) => {
    const stateObj = NIGERIAN_STATES.find((s) => s.name === newState);
    setCustomer({
      ...customer,
      state: newState,
      cityOrLga: stateObj && stateObj.lgas.length > 0 ? stateObj.lgas[0] : ''
    });
  };

  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('6789725821');
      setCopiedAccount(true);
      showToast('Moniepoint Account (6789725821) copied to clipboard!', 'info');
      setTimeout(() => setCopiedAccount(false), 3000);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.deliveryAddress) {
      showToast('Please fill all required delivery information fields', 'warning');
      return;
    }
    setStep('payment');
  };

  // Ensure Monnify SDK is loaded (fallback dynamic loader)
  const ensureMonnifySDK = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && window.MonnifySDK) {
      return true;
    }
    return new Promise((resolve) => {
      const existing = document.querySelector('script[src*="monnify.js"]');
      if (existing) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.MonnifySDK) {
            clearInterval(interval);
            resolve(true);
          } else if (attempts > 20) {
            clearInterval(interval);
            resolve(false);
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.monnify.com/plugin/monnify.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => resolve(!!window.MonnifySDK);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const handleMonnifyPayment = async () => {
    setIsProcessingPayment(true);
    // Uniquely generated transaction ID
    const paymentRef = 'REF_' + Date.now();
    const custEmail = customer.email.trim() || `${customer.phone.replace(/[^0-9]/g, '') || 'buyer'}@customer.monnify.com`;
    const custName = customer.fullName.trim() || 'Valued Customer';

    const cleanApiKey = monnifyApiKey.trim() || 'MK_TEST_QPA6P8AKKQ';
    const cleanContractCode = monnifyContractCode.trim() || '1640726152';

    if (isContractCodeLikelySecretKey) {
      console.warn("Notice: Monnify contract code appears to be the 32-character Secret Key instead of 10-digit Contract Code.");
      showToast("Launching Monnify... Note: Your 10-digit Contract Code is 1640726152.", 'info');
    }

    const sdkLoaded = await ensureMonnifySDK();

    if (sdkLoaded && window.MonnifySDK) {
      try {
        window.MonnifySDK.initialize({
          amount: grandTotal,
          currency: 'NGN',
          reference: paymentRef,
          customerName: custName,
          customerFullName: custName,
          customerEmail: custEmail,
          customerMobileNumber: customer.phone,
          apiKey: cleanApiKey,
          contractCode: cleanContractCode,
          paymentDescription: `Stubborn Rat Killer Order (${totalDeliveredJars} Jars)`,
          isTestMode: isMonnifyTestMode || cleanApiKey.startsWith('MK_TEST_'),
          paymentMethods: ['CARD', 'ACCOUNT_TRANSFER', 'USSD', 'PHONE_NUMBER'],
          onLoadStart: () => {
            setIsProcessingPayment(true);
          },
          onLoadComplete: () => {
            setIsProcessingPayment(false);
          },
          onComplete: (response: {
            authorizedAmount?: number;
            paymentReference?: string;
            transactionReference?: string;
            paymentStatus: string;
            responseMessage?: string;
            paidOn?: string;
            [key: string]: unknown;
          }) => {
            setIsProcessingPayment(false);
            console.log('Monnify onComplete response:', response);
            const statusUpper = (response?.paymentStatus || '').toUpperCase();
            if (statusUpper === 'SUCCESS' || statusUpper === 'PAID') {
              const order = createOrder({
                customer,
                items: [...cart],
                subtotal: cartSubtotal,
                deliveryFee,
                discount: couponDiscount,
                couponCode: appliedCoupon || undefined,
                total: grandTotal,
                paymentMethod: 'monnify',
                paymentStatus: 'Paid',
                monnifyReference: response?.paymentReference || paymentRef,
                monnifyTransactionReference: response?.transactionReference || response?.paymentReference || paymentRef
              });
              // Clear the shopping cart
              clearCart();
              // Route to customized 'Thank You' page
              setCompletedOrder(order);
              setStep('success');
              showToast('Monnify payment confirmed successfully!', 'success');
              try {
                confetti({
                  particleCount: 90,
                  spread: 80,
                  origin: { y: 0.6 }
                });
              } catch (err) {
                console.error(err);
              }
            } else {
              showToast(response?.responseMessage || 'Payment was cancelled or unsuccessful.', 'warning');
            }
          },
          onClose: (data: unknown) => {
            // Log the cancellation gracefully without wiping the cart data
            console.log('Monnify payment cancelled by customer:', data);
            setIsProcessingPayment(false);
            if (isContractCodeLikelySecretKey) {
              showToast("Monnify window closed. If you saw 'Transaction Failed', please enter your 10-digit Contract Code from Monnify Dashboard (Settings > Contracts) or click Test Payment Simulation.", 'warning');
            } else {
              showToast('Monnify payment closed. Your shopping cart items have been saved.', 'info');
            }
          }
        });
        return;
      } catch (err) {
        console.error('Error launching Monnify SDK:', err);
        setIsProcessingPayment(false);
        showToast('Unable to launch Monnify window. Please check your internet or choose Direct Bank Transfer.', 'error');
        return;
      }
    }

    // If Monnify SDK could not load (e.g., adblocker, strict firewall, or offline)
    setIsProcessingPayment(false);
    showToast('Monnify gateway could not be loaded. Please disable adblockers, or select Direct Bank Deposit (Moniepoint MFB 6789725821).', 'warning');
  };

  const handleCompleteOrder = () => {
    if (paymentMethod === 'monnify') {
      handleMonnifyPayment();
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const order = createOrder({
        customer,
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        discount: couponDiscount,
        couponCode: appliedCoupon || undefined,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'bank_transfer' || paymentMethod === 'debit_card' ? 'Pending Verification' : 'Unpaid',
        proofOfPaymentNote: proofNote || undefined
      });

      setCompletedOrder(order);
      setIsProcessingPayment(false);
      setStep('success');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }
    }, 1200);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        id="checkout-modal-container"
        className="relative bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-900 flex flex-col"
      >
        {/* Top Accent Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-t-3xl" />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 font-['Outfit'] tracking-wide">
                {step === 'details' && '1. YOUR ADDRESS & PHONE NUMBER'}
                {step === 'payment' && '2. HOW DO YOU WANT TO PAY?'}
                {step === 'success' && '3. ORDER SUCCESSFUL!'}
              </h2>
              <span className="text-xs text-amber-700 font-mono font-bold">Safe & Easy Checkout</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-colors shadow-xs"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Customer Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Quick Order Summary Mini Bar */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-slate-900">
                  {totalJars} {totalJars === 1 ? 'Jar' : 'Jars'}
                </span>
                {freeBonusJars > 0 && (
                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    🎁 +1 Free Jar ({totalDeliveredJars} Total Delivered)
                  </span>
                )}
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">Subtotal: <strong className="text-slate-900 font-mono">{formatPrice(cartSubtotal)}</strong></span>
              </div>
              <span className="text-slate-950 font-black font-mono text-sm bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
                Total: {formatPrice(grandTotal)}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                Where Should We Deliver To?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukwuemeka Adeleke"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Phone Number (WhatsApp Number) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0808 985 4753"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. buyer@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Second Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0812 987 6543"
                    value={customer.altPhone}
                    onChange={(e) => setCustomer({ ...customer, altPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono font-medium shadow-xs"
                  />
                </div>
              </div>

              {/* State & LGA Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Your State <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={customer.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-bold shadow-xs"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({formatPrice(s.fee)} • {s.days})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    LGA / Area <span className="text-red-600">*</span>
                  </label>
                  {selectedStateObj.lgas.length > 0 ? (
                    <select
                      value={customer.cityOrLga}
                      onChange={(e) => setCustomer({ ...customer, cityOrLga: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-bold shadow-xs"
                    >
                      {selectedStateObj.lgas.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. City / Town name"
                      value={customer.cityOrLga}
                      onChange={(e) => setCustomer({ ...customer, cityOrLga: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 shadow-xs"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Street Address & House Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No 12 Olufemi Street, off Adeniran Ogunsanya"
                  value={customer.deliveryAddress}
                  onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Bus Stop, Landmark or Note for Rider
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Total Filling Station, or call when you reach the gate"
                  value={customer.landmark}
                  onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Delivery time: <strong className="text-amber-700 font-bold">{selectedStateObj.days}</strong>
              </span>

              <button
                type="submit"
                id="checkout-next-payment-btn"
                className="px-6 py-3 btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm"
              >
                <span>Next: Choose How to Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Selection */}
        {step === 'payment' && (
          <div className="p-6 space-y-6">
            {/* Amount Banner */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Amount to Pay</span>
                <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono mt-0.5">
                  {formatPrice(grandTotal)}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Includes {deliveryFee === 0 ? 'Free Delivery' : `${formatPrice(deliveryFee)} Delivery Fee`}
                </span>
              </div>

              <button
                onClick={() => setStep('details')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline uppercase tracking-wider"
              >
                ← Change Address
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  How do you want to pay?
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Moniepoint Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Monnify by Moniepoint Option */}
                {isMonnifyEnabled && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('monnify')}
                    id="checkout-paymethod-monnify"
                    className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all relative overflow-hidden ${
                      paymentMethod === 'monnify'
                        ? 'bg-blue-50/90 border-blue-600 text-slate-950 shadow-xs ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Zap className="w-4 h-4 fill-white" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Instant
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-black block text-slate-950">Monnify (Moniepoint)</span>
                      <span className="text-[10px] text-blue-700 font-bold line-clamp-1">Cards, Transfer, USSD</span>
                    </div>
                  </button>
                )}

                {/* Direct Bank Transfer Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  id="checkout-paymethod-transfer"
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-amber-50 border-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-950">Direct Bank Deposit</span>
                    <span className="text-[10px] text-slate-500 font-medium line-clamp-1">Moniepoint MFB</span>
                  </div>
                </button>

                {/* Pay on Delivery Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_on_delivery')}
                  id="checkout-paymethod-pod"
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'pay_on_delivery'
                      ? 'bg-amber-50 border-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-950">Pay on Delivery</span>
                    <span className="text-[10px] text-slate-500 font-medium line-clamp-1">Cash or POS to rider</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Details Container */}
            {paymentMethod === 'monnify' && (
              <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/80 border-2 border-blue-400 space-y-3.5 text-xs shadow-xs animate-in fade-in">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-950 uppercase tracking-tight block">
                          Monnify by Moniepoint
                        </span>
                        <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded-md">
                          Automated
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium block">
                        Instant online payment confirmation with no receipt uploads needed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract & Payment Methods Information Badge */}
                <div className="bg-white p-3.5 rounded-2xl border border-blue-200 space-y-3 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contract:</span>
                      <span className="text-xs font-black text-slate-900 font-['Outfit']">{monnifyContractName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                      <span className="text-[10px] text-blue-600 font-bold uppercase">Code:</span>
                      <strong className="font-black">{monnifyContractCode || '1640726152'}</strong>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-2">
                      Enabled Payment Methods:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">Card</span>
                          <span className="text-[9px] text-slate-500 font-normal">Verve, Visa, Mastercard</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">Account Transfer</span>
                          <span className="text-[9px] text-slate-500 font-normal">Dynamic Virtual Account</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">USSD</span>
                          <span className="text-[9px] text-slate-500 font-normal">All Nigerian Banks</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">Direct Debit</span>
                          <span className="text-[9px] text-slate-500 font-normal">Direct Bank Authorization</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-red-600 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">Cash</span>
                          <span className="text-[9px] text-slate-500 font-normal">Cash &amp; Agent Options</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="block font-black text-slate-900 text-[11px]">Phone Number</span>
                          <span className="text-[9px] text-slate-500 font-normal">Moniepoint &amp; OPay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isContractCodeLikelySecretKey && (
                  <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-300 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-black text-amber-950 text-xs flex items-center gap-2">
                          <span>Notice: Monnify Contract Code Setup</span>
                          <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                            Secret Key Detected
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                          Your contract code should be the 10-digit number <code className="bg-amber-200/70 text-amber-950 px-1 py-0.5 rounded font-mono font-bold text-[10px]">1640726152</code>.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/80">
                      <button
                        type="button"
                        onClick={() => {
                          setMonnifyContractCode('1640726152');
                          showToast('Contract code restored to 1640726152', 'success');
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Use 1640726152</span>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleMonnifyPayment}
                  disabled={isProcessingPayment}
                  id="checkout-pay-with-monnify-inner-btn"
                  className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {isProcessingPayment ? 'Connecting Monnify...' : `Pay with Monnify (${formatPrice(grandTotal)})`}
                  </span>
                </button>

                <div className="flex items-center justify-center text-[11px] text-slate-500 gap-1.5 font-medium py-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Moniepoint Monnify 256-Bit SSL PCI-DSS Certified</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-700 bg-blue-100/60 p-2.5 rounded-xl border border-blue-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-blue-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant Automated Verification</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {monnifyApiKey.trim() ? 'Monnify Gateway Active' : 'Monnify Demo Mode'}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/70 border border-amber-300 space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-950 uppercase tracking-tight block">
                        Official Bank Deposit Account
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium block">
                        Transfer directly from any bank app or USSD
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg shrink-0 uppercase tracking-wider">
                    Moniepoint MFB
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-bold uppercase truncate">
                      DOLIVA RESOURCES LTD
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-wider mt-0.5">
                      6789725821
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Instant Same-Day Dispatch Confirmation</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-4 py-2.5 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    Your Name or Transfer Note:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid by Emeka via GTBank"
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'pay_on_delivery' && (
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5 text-slate-700 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>How Pay on Delivery Works:</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  Our dispatch rider will bring your package to your address in <strong className="text-slate-950">{customer.state}</strong>. Please have your cash (<strong>{formatPrice(grandTotal)}</strong>) or ATM card ready to pay the rider upon delivery.
                </p>
              </div>
            )}

            {/* Confirm and Pay Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                ← Back to Details
              </button>

              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={isProcessingPayment}
                id="checkout-confirm-pay-btn"
                className={`px-6 py-3.5 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 disabled:opacity-50 shadow-sm transition-all ${
                  paymentMethod === 'monnify'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-700 shadow-md'
                    : 'btn-3d-yellow'
                }`}
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>{paymentMethod === 'monnify' ? 'Connecting Monnify...' : 'Placing Your Order...'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {paymentMethod === 'monnify' ? (
                      <Zap className="w-4 h-4 fill-white" />
                    ) : (
                      <Check className="w-4 h-4 stroke-[3]" />
                    )}
                    <span>
                      {paymentMethod === 'monnify'
                        ? `Pay with Monnify (${formatPrice(grandTotal)})`
                        : paymentMethod === 'bank_transfer'
                          ? `Confirm Bank Transfer (${formatPrice(grandTotal)})`
                          : `Complete Order (${formatPrice(grandTotal)})`}
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'success' && completedOrder && (
          <div className="p-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md border-2 border-slate-950 animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-300 px-3 py-1 rounded-md shadow-xs">
                ORDER SUCCESSFUL!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 font-['Outfit']">
                Thank You, {completedOrder.customer.fullName}!
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-normal">
                We have received your order. We are packing your Stubborn Rat Killer now for delivery.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Order Number:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{completedOrder.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tracking Code:</span>
                  <span className="font-mono font-black text-amber-700 text-sm">{completedOrder.trackingNumber}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items Ordered:</span>
                  <strong className="text-slate-900 font-bold">
                    {totalJars} Paid {totalJars === 1 ? 'Jar' : 'Jars'}
                    {freeBonusJars > 0 ? ` (+1 FREE Jar = ${totalDeliveredJars} Total)` : ''}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sent To:</span>
                  <strong className="text-slate-900 font-bold">{completedOrder.customer.fullName} ({completedOrder.customer.phone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="text-slate-800 font-medium">{completedOrder.customer.deliveryAddress}, {completedOrder.customer.cityOrLga}, {completedOrder.customer.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Delivery:</span>
                  <span className="text-amber-700 font-bold">{completedOrder.estimatedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="uppercase text-slate-900 font-bold">
                    {completedOrder.paymentMethod === 'monnify' ? 'Monnify by Moniepoint (Paid Online)' : completedOrder.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
                <span>Total:</span>
                <span className="font-mono text-red-600 text-lg font-black">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            {/* Monnify Payment Confirmation Card */}
            {completedOrder.paymentMethod === 'monnify' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border-2 border-blue-400 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Monnify (Moniepoint) Payment Confirmed
                  </span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded uppercase">
                    Paid Online
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Monnify Transaction Reference:
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-black text-slate-950 tracking-wider block break-all">
                    {completedOrder.monnifyReference || 'MNFY-VERIFIED'}
                  </span>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Payment verified instantly • Receipt dispatched</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your payment of <strong>{formatPrice(completedOrder.total)}</strong> has been successfully recorded. Your parcel is queued for same-day priority dispatch to <strong>{completedOrder.customer.state}</strong>.
                </p>

                <a
                  href={`https://wa.me/2348089854753?text=${encodeURIComponent(`Hello Oliver, I have completed my payment of ${formatPrice(completedOrder.total)} via Monnify (Moniepoint) for Order #${completedOrder.orderNumber} (Ref: ${completedOrder.monnifyReference || 'Paid'}). Please proceed with delivery to ${completedOrder.customer.state}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Dispatch on WhatsApp (Optional)</span>
                </a>
              </div>
            )}

            {/* Bank Transfer Deposit Reminder */}
            {completedOrder.paymentMethod === 'bank_transfer' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Complete Bank Deposit for Order #{completedOrder.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    Official Account
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Moniepoint MFB • DOLIVA RESOURCES LTD
                    </span>
                    <span className="font-mono text-lg font-black text-slate-950 tracking-wider block mt-0.5">
                      6789725821
                    </span>
                    <span className="text-[11px] font-bold text-red-600 block mt-0.5">
                      Amount to Transfer: {formatPrice(completedOrder.total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-3.5 py-2 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shrink-0 shadow-xs"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  After transfer, kindly share your payment proof or transaction screenshot to our WhatsApp dispatch line for immediate confirmation & dispatch.
                </p>

                <a
                  href={`https://wa.me/2348089854753?text=${encodeURIComponent(`Hello, I have made a bank deposit of ${formatPrice(completedOrder.total)} for Order #${completedOrder.orderNumber} to DOLIVA RESOURCES LTD (Moniepoint MFB: 6789725821). Here is my payment receipt screenshot.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Payment Proof on WhatsApp</span>
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrintInvoice}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveView('order-tracking');
                }}
                className="px-6 py-3 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm"
              >
                <Truck className="w-4 h-4" />
                <span>Track Where It Is</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
