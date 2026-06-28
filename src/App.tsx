import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/ui/PageLoader';
import PageTransition from '@/components/ui/PageTransition';
import { useSmoothScroll } from '@/lib/smooth-scroll';

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const Destinations = lazy(() => import('@/pages/Destinations'));
const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'));
const Recommendations = lazy(() => import('@/pages/Recommendations'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  useSmoothScroll();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col selection:bg-forest-600/30 selection:text-forest-50 relative">
      {/* Cinematic Noise Overlay — isolated rendering to prevent per-frame recomposite */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          contain: 'strict',
          willChange: 'auto',
        }}
      />
      
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/destinations" element={<PageTransition><Destinations /></PageTransition>} />
              <Route path="/destinations/:id" element={<PageTransition><DestinationDetail /></PageTransition>} />
              <Route path="/recommendations" element={<PageTransition><Recommendations /></PageTransition>} />
              <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
