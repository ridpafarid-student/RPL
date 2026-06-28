import Hero from '@/components/Hero';
import RecommendationSection from '@/components/RecommendationSection';
import InfiniteMarquee from '@/components/ui/InfiniteMarquee';
import { usePageMeta } from '@/lib/use-page-meta';
import HorizontalFeatures from '@/components/HorizontalFeatures';

export default function Home() {
  usePageMeta('Beranda', 'Bogornesia — Jelajahi pesona wisata alam, budaya, dan petualangan di Kota Hujan Bogor.');

  return (
    <>
      <Hero />
      
      <InfiniteMarquee />

      <HorizontalFeatures />

      <RecommendationSection />
    </>
  );
}
