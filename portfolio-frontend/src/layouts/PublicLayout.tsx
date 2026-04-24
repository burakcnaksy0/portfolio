import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { AnimatePresence } from 'framer-motion';

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
