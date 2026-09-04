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
  Sparkles
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    couponDiscount,
    appliedCoupon,
    createOrder,
    formatPrice,
    showToast,
    setActiveView
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
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

  // Reset when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('details');
      setCompletedOrder(null);
      setIsProcessingPayment(false);
    }
  }, [isCheckoutOpen]);

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
      navigator.clipboard.writeText('8123456789');
      setCopiedAccount(true);
      showToast('Account Number copied to clipboard!', 'info');
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

  const handleCompleteOrder = () => {
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
        paymentStatus: paymentMethod === 'debit_card' ? 'Paid' : paymentMethod === 'bank_transfer' ? 'Pending Verification' : 'Unpaid',
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
                {step === 'details' && '1. DELIVERY DESTINATION & DETAILS'}
                {step === 'payment' && '2. SECURE PAYMENT GATEWAY'}
                {step === 'success' && '3. ORDER CONFIRMED & DISPATCH RECEIPT'}
              </h2>
              <span className="text-xs text-amber-700 font-mono font-bold">256-Bit SSL Secured Order Portal</span>
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
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900">Units: {cart.length}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">Subtotal: <strong className="text-slate-900 font-mono">{formatPrice(cartSubtotal)}</strong></span>
              </div>
              <span className="text-slate-950 font-black font-mono text-sm bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
                Est. Total: {formatPrice(grandTotal)}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                Delivery Address & Contact Point
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
                    Phone Number (WhatsApp Active) <span className="text-red-600">*</span>
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
                    Email Address (For Waybill Receipt)
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
                    Alternate Emergency Line
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
                    State of Dispatch <span className="text-red-600">*</span>
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
                    LGA / Town Area <span className="text-red-600">*</span>
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
                  Full Street Address & Building Details <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 4B, Plot 12 Olufemi Street, off Adeniran Ogunsanya"
                  value={customer.deliveryAddress}
                  onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nearest Landmark or Special Rider Instruction
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beside Total Energy Station, or Please deliver in discreet packaging"
                  value={customer.landmark}
                  onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium shadow-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Guaranteed transit: <strong className="text-amber-700 font-bold">{selectedStateObj.days}</strong>
              </span>

              <button
                type="submit"
                id="checkout-next-payment-btn"
                className="px-6 py-3 btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Secure Payment</span>
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
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Payable Amount</span>
                <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono mt-0.5">
                  {formatPrice(grandTotal)}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Includes {deliveryFee === 0 ? 'Free Nationwide Delivery' : `${formatPrice(deliveryFee)} Dispatch Courier Fee`}
                </span>
              </div>

              <button
                onClick={() => setStep('details')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline uppercase tracking-wider"
              >
                ← Edit Address
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Payment Channel:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-amber-50 border-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-950">Direct Bank Transfer</span>
                    <span className="text-[10px] text-slate-500 font-medium">Instant Account Verification</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('debit_card')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'debit_card'
                      ? 'bg-amber-50 border-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-950">Debit / ATM Card</span>
                    <span className="text-[10px] text-slate-500 font-medium">MasterCard / Verve / Visa</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_on_delivery')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-28 transition-all ${
                    paymentMethod === 'pay_on_delivery'
                      ? 'bg-amber-50 border-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black block text-slate-950">Pay on Delivery</span>
                    <span className="text-[10px] text-slate-500 font-medium">Cash / POS on Arrival</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Details Container */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">Official Moniepoint Account:</span>
                  <span className="text-amber-800 font-mono text-xs font-bold bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
                    Active & Instant Reconciled
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Bank Name:</span>
                    <strong className="text-slate-900 text-xs font-bold">Moniepoint Microfinance Bank</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Beneficiary:</span>
                    <strong className="text-slate-900 text-xs font-bold">STUBBORN RAT KILLER LTD</strong>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-300 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-amber-700 uppercase font-mono font-bold">Account Number:</span>
                    <div className="text-xl font-black text-slate-950 font-mono tracking-widest mt-0.5">
                      8123456789
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-4 py-2 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase">
                    Sender Name or Reference Note:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via GTBank mobile app by Emeka"
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-medium shadow-xs"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'debit_card' && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">Paystack / Interswitch Secured</span>
                  <div className="flex gap-1.5 text-slate-700 font-mono text-[10px] font-bold">
                    <span>VISA</span> • <span>MASTERCARD</span> • <span>VERVE</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-[11px] mb-1 uppercase">Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-mono text-slate-900 text-xs font-bold shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold text-[11px] mb-1 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-mono text-slate-900 text-xs font-bold shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold text-[11px] mb-1 uppercase">CVV / Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-mono text-slate-900 text-xs font-bold shadow-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'pay_on_delivery' && (
              <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5 text-slate-700 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Pay on Delivery Terms:</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  Our regional courier will deliver to your designated address in <strong className="text-slate-950">{customer.state}</strong>. Please ensure cash (<strong>{formatPrice(grandTotal)}</strong>) or an active ATM card is ready for the rider.
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
                className="px-6 py-3.5 btn-3d-yellow text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Authorizing Dispatch Order...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm & Dispatch Order ({formatPrice(grandTotal)})</span>
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
                ORDER DISPATCH INITIATED!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 font-['Outfit']">
                Order Received, {completedOrder.customer.fullName}!
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-normal">
                Your Stubborn Rat Killer order is being prepared for immediate dispatch.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Order ID:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{completedOrder.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Waybill Tracking:</span>
                  <span className="font-mono font-black text-amber-700 text-sm">{completedOrder.trackingNumber}</span>
                </div>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <strong className="text-slate-900 font-bold">{completedOrder.customer.fullName} ({completedOrder.customer.phone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-slate-800 font-medium">{completedOrder.customer.deliveryAddress}, {completedOrder.customer.cityOrLga}, {completedOrder.customer.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Transit:</span>
                  <span className="text-amber-700 font-bold">{completedOrder.estimatedDeliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="uppercase text-slate-900 font-bold">{completedOrder.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
                <span>Total Amount:</span>
                <span className="font-mono text-red-600 text-lg font-black">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrintInvoice}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Waybill</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setActiveView('order-tracking');
                }}
                className="px-6 py-3 rounded-2xl btn-3d-yellow text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Delivery Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
