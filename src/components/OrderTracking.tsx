import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Lock,
  Unlock,
  Shield
} from 'lucide-react';
import { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const { lookupOrder, formatPrice, setActiveView } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneVerification, setPhoneVerification] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanQuery = orderQuery.trim();
    if (!cleanQuery) {
      setErrorMessage('Please enter your Order Number (e.g. SPK-12345) or Tracking Code.');
      return;
    }

    const res = lookupOrder(cleanQuery, phoneVerification);
    if (res && res.order) {
      setFoundOrder(res.order);
      setIsVerified(res.verified);
      setHasSearched(true);
    } else {
      setFoundOrder(null);
      setIsVerified(false);
      setHasSearched(true);
    }
  };

  const handleVerifyPhoneInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundOrder || !phoneVerification.trim()) return;
    const res = lookupOrder(foundOrder.orderNumber, phoneVerification);
    if (res && res.order) {
      setFoundOrder(res.order);
      setIsVerified(res.verified);
      if (!res.verified) {
        setErrorMessage('Phone digits did not match this order. Please check the last 4 digits.');
      } else {
        setErrorMessage('');
      }
    }
  };

  const getStepStatus = (orderStatus: string, stepIndex: number) => {
    // 0: Placed, 1: Packed, 2: Dispatched, 3: Delivered
    const statusMap: Record<string, number> = {
      'Processing': 0,
      'Confirmed': 1,
      'Dispatched': 2,
      'Delivered': 3,
      'Cancelled': -1
    };
    const current = statusMap[orderStatus] ?? 1;
    if (current > stepIndex) return 'completed';
    if (current === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider shadow-xs">
          <Truck className="w-4 h-4 text-red-600" />
          <span>Secure Order Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight">
          TRACK YOUR DELIVERY
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-normal">
          Enter your Order Number (e.g. <strong className="text-red-600 font-mono">SPK-98421</strong>) to check the live status of your Stubborn Rat Killer delivery.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-slate-50 border border-slate-300 rounded-3xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => {
              setOrderQuery(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Order Number (e.g. SPK-98421) or Tracking Code..."
            className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs font-mono font-medium"
          />
          <Search className="w-4 h-4 text-amber-500 absolute left-4 pointer-events-none" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              maxLength={4}
              value={phoneVerification}
              onChange={(e) => setPhoneVerification(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Last 4 digits of phone (for full address unlock)..."
              className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-3 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs font-mono"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 btn-3d-yellow text-slate-950 font-black text-xs rounded-2xl shadow-xs whitespace-nowrap"
          >
            TRACK STATUS
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 px-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}
      </form>

      {/* Result Display */}
      {foundOrder ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 relative overflow-hidden">
          {/* Top Accent line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 mb-6" />

          {/* Order Title Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-950 font-mono tracking-tight">
                  Order #{foundOrder.orderNumber}
                </h3>
                <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                  foundOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : foundOrder.orderStatus === 'Dispatched'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {foundOrder.orderStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Placed on {new Date(foundOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block font-bold">Tracking Code:</span>
              <span className="text-base font-black text-red-600 font-mono">
                {foundOrder.trackingNumber}
              </span>
            </div>
          </div>

          {/* Privacy Verification Status Banner */}
          <div className={`p-4 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
            isVerified 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-blue-50/80 border-blue-200 text-blue-950'
          }`}>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Shield className="w-5 h-5 text-blue-600 shrink-0" />
              )}
              <div>
                <strong className="block font-black">
                  {isVerified ? 'Customer Identity Confirmed' : 'Customer Privacy Protected'}
                </strong>
                <span className="text-[11px] text-slate-600 font-medium">
                  {isVerified 
                    ? 'Full delivery address, recipient details, and courier notes unlocked.' 
                    : 'Home address is masked to protect customer privacy against unauthorized lookup.'}
                </span>
              </div>
            </div>

            {!isVerified && (
              <form onSubmit={handleVerifyPhoneInline} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={phoneVerification}
                  onChange={(e) => setPhoneVerification(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Last 4 phone digits..."
                  className="bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 w-36 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock</span>
                </button>
              </form>
            )}
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-['Outfit']">
              Delivery Steps
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {[
                { title: 'Order Received', desc: 'We got your order details', icon: Package },
                { title: 'Package Packed', desc: 'Sealed tight in clean bottle', icon: ShieldCheck },
                { title: 'On The Way', desc: `Sent out with rider to ${foundOrder.customer.state}`, icon: Truck },
                { title: 'Delivered', desc: 'Received and confirmed by you', icon: CheckCircle2 }
              ].map((stepItem, idx) => {
                const status = getStepStatus(foundOrder.orderStatus, idx);
                let badgeClass = 'bg-slate-50 border border-slate-200 text-slate-500';
                let iconColor = 'text-slate-400';

                if (status === 'completed') {
                  badgeClass = 'bg-amber-50/70 border border-amber-300 text-amber-800 shadow-xs';
                  iconColor = 'text-amber-600';
                } else if (status === 'active') {
                  badgeClass = 'bg-red-50 border-2 border-red-500 text-slate-900 shadow-xs';
                  iconColor = 'text-red-600';
                }

                const StepIcon = stepItem.icon;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl ${badgeClass} space-y-2 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <StepIcon className={`w-5 h-5 ${iconColor}`} />
                      <span className="text-[10px] font-mono font-black uppercase text-amber-700">
                        Step {idx + 1}
                      </span>
                    </div>
                    <h5 className="font-black text-xs text-slate-900">{stepItem.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-tight font-normal">{stepItem.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            {/* Delivery Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                  Where It Is Going
                </span>
                {isVerified ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Protected</span>
                  </span>
                )}
              </div>

              <p className="text-slate-900 font-bold">{foundOrder.customer.fullName}</p>
              
              {isVerified ? (
                <p className="text-slate-700 font-normal leading-relaxed">
                  {foundOrder.customer.deliveryAddress}, {foundOrder.customer.cityOrLga}, {foundOrder.customer.state}
                </p>
              ) : (
                <p className="text-slate-500 italic font-normal leading-relaxed">
                  Destination: {foundOrder.customer.cityOrLga}, {foundOrder.customer.state}
                  <span className="block text-[10px] text-slate-400 not-italic mt-0.5">
                    (Street address hidden for privacy. Enter phone digits above to reveal)
                  </span>
                </p>
              )}

              <p className="text-slate-500 font-mono">
                Phone: {foundOrder.customer.phone}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-amber-700 font-bold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Expected Delivery: {foundOrder.estimatedDeliveryDate}</span>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Items in Your Order
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto divide-y divide-slate-200">
                {foundOrder.items.map((it, i) => (
                  <div key={i} className="pt-1 flex items-center justify-between">
                    <span className="text-slate-800 truncate max-w-[200px] font-medium">
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="text-slate-950 font-mono font-bold">
                      {formatPrice(it.product.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-950">
                <span>Total Amount:</span>
                <span className="text-red-600 font-mono font-black">{formatPrice(foundOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Direct Support */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Have questions about your delivery or need same-day dispatch?</span>
            </div>
            <a
              href={`https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer%20Support,%20I%20am%20tracking%20order%20${encodeURIComponent(foundOrder.orderNumber)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 btn-3d-yellow text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp (+234 808 985 4753)</span>
            </a>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-base font-black text-slate-950">No Order Found</h3>
          <p className="text-xs text-slate-600 font-normal">
            We could not find any order matching "{orderQuery}". Please confirm your Order Number from your SMS/WhatsApp confirmation or chat with our dispatch team.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <a
              href="https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer,%20I%20need%20help%20checking%20my%20order%20status."
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={() => setActiveView('shop')}
              className="px-5 py-2.5 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl shadow-xs"
            >
              Back to Store
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-950">Real-Time Dispatch Tracker</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Enter your 5-digit Order Number (e.g. <span className="text-amber-700 font-mono font-bold">SPK-10293</span>) to see if your order is packaged, on transit with our dispatch rider, or delivered.
          </p>
        </div>
      )}
    </div>
  );
};
