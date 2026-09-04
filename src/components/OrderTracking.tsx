import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const { lookupOrder, formatPrice, orders, setActiveView } = useStore();
  const [query, setQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const result = lookupOrder(query);
    setFoundOrder(result || null);
    setHasSearched(true);
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
          <span>Real-Time Express Logistics Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-['Outfit'] tracking-tight">
          TRACK YOUR DISPATCH ORDER
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-normal">
          Enter your Order Reference Number (e.g. <strong className="text-red-600 font-mono">SPK-98421</strong>), Tracking Code, or Phone Number.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. SPK-98421 or TRK-LG-77892 or 0808..."
          className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-32 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white shadow-sm font-medium"
        />
        <Search className="w-5 h-5 text-amber-500 absolute left-4 pointer-events-none" />
        <button
          type="submit"
          className="absolute right-2 px-6 py-2.5 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl shadow-xs"
        >
          TRACK ORDER
        </button>
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
              <span className="text-xs text-slate-500 block font-bold">Waybill / Tracking Code:</span>
              <span className="text-base font-black text-red-600 font-mono">
                {foundOrder.trackingNumber}
              </span>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-['Outfit']">
              Dispatch & Delivery Milestones
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {[
                { title: 'Order Received', desc: 'Payment & address verified', icon: Package },
                { title: 'Security Inspection', desc: 'Sealed in leak-proof packaging', icon: ShieldCheck },
                { title: 'Dispatched with Courier', desc: `Express delivery to ${foundOrder.customer.state}`, icon: Truck },
                { title: 'Delivered', desc: 'Signed & confirmed by customer', icon: CheckCircle2 }
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
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Delivery Destination
              </span>
              <p className="text-slate-900 font-bold">{foundOrder.customer.fullName}</p>
              <p className="text-slate-600 font-normal">{foundOrder.customer.deliveryAddress}, {foundOrder.customer.cityOrLga}, {foundOrder.customer.state}</p>
              <p className="text-slate-500 font-mono">Phone: {foundOrder.customer.phone}</p>
              <div className="pt-2 flex items-center gap-1.5 text-amber-700 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Estimated Arrival: {foundOrder.estimatedDeliveryDate}</span>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Items in Package
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
              <span>Need delivery acceleration or guidance on placement?</span>
            </div>
            <a
              href={`https://wa.me/2348089854753?text=Hello%20Stubborn%20Rat%20Killer%20Support,%20I%20am%20tracking%20order%20${encodeURIComponent(foundOrder.orderNumber)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 btn-3d-yellow text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Dispatch Desk (+234 808 985 4753)</span>
            </a>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-base font-black text-slate-950">No Order Found</h3>
          <p className="text-xs text-slate-600 font-normal">
            We could not find an order matching "{query}". Please check your order reference number in your WhatsApp dispatch confirmation or invoice.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-2.5 btn-3d-yellow text-slate-950 font-black text-xs rounded-xl shadow-xs"
          >
            Back to Product
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-950">Live Customer Order Tracking</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Enter the Order Reference (e.g. <span className="text-amber-700 font-mono font-bold">SPK-...</span>) or your delivery phone number above to view real-time dispatch milestones, courier handover status, and delivery timelines.
          </p>
        </div>
      )}
    </div>
  );
};
