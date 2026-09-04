import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { SingleProductShowcase } from './components/SingleProductShowcase';
import { RodentTargetMatrix } from './components/RodentTargetMatrix';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <PromoBanner />
      <Navbar />

      <main className="flex-1 w-full max-w-full overflow-x-hidden bg-white">
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : activeView === 'order-tracking' ? (
          <OrderTracking />
        ) : (
          <div className="space-y-10 pb-12">
            {/* The Hero Section placed directly above the product */}
            <HeroSection />

            {/* Single Product Showcase */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SingleProductShowcase />
            </div>

            {/* Lethal Target Species Matrix */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RodentTargetMatrix />
            </div>

            {/* Trust Badges & Guarantee bar */}
            <TrustBadges />
          </div>
        )}
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <OwnerLoginModal />
      <ToastContainer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
