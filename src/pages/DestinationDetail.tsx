import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import MapView from '@/components/MapView';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { destinations } from '@/data/destinations';
import { addFavorite, isFavorite as checkFavorite, removeFavorite } from '@/utils/favoriteStorage';
import { usePageMeta } from '@/lib/use-page-meta';

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function formatCurrency(value: number | undefined): string {
  if (typeof value !== 'number') return 'Hubungi pengelola';
  if (value <= 0) return 'Gratis';
  return `Rp${value.toLocaleString('id-ID')}`;
}

export default function DestinationDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  // Parallax Setup
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const destination = useMemo(() => destinations.find((d) => d.id === id), [id]);

  usePageMeta(destination?.name || 'Detail Destinasi', destination?.description);

  const images = useMemo(() => {
    if (!destination) return [];
    if (Array.isArray(destination.photos) && destination.photos.length > 0) return destination.photos;
    return [destination.image, destination.photoUrl, destination.fotoUrl].filter(Boolean) as string[];
  }, [destination]);

  const heroImage = images[0] || 'https://placehold.co/1200x800/0A1F14/40916C?text=Foto+Tidak+Tersedia';
  const galleryImages = images.length > 1 ? images.slice(1) : images;

  const cats = Array.isArray(destination?.category) ? destination.category : [destination?.category].filter(Boolean);

  const openDays = useMemo(() => {
    if (!destination?.openingHours?.length) return [];
    return [...destination.openingHours].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  }, [destination]);

  const related = useMemo(() => {
    if (!destination) return [];
    return destinations
      .filter((d) => d.id !== destination.id)
      .filter((d) => d.category.some((c) => destination.category.includes(c)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [destination]);

  useEffect(() => {
    if (destination) setIsFavorite(checkFavorite(destination.id));
    // Reset scroll and lightbox on route change
    window.scrollTo(0, 0);
    setActiveImage(null);
  }, [destination, id]);

  const handleFavoriteClick = () => {
    if (!destination) return;
    if (checkFavorite(destination.id)) {
      removeFavorite(destination.id);
      setIsFavorite(false);
    } else {
      addFavorite(destination);
      setIsFavorite(true);
    }
  };

  if (!destination) {
    return (
      <section className="shell py-32 flex min-h-[70vh] items-center justify-center">
        <div className="glass-card p-10 text-center max-w-xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-forest-100 mb-4">Destinasi tidak ditemukan</h1>
          <p className="text-forest-400">Pastikan URL benar atau kembali ke direktori.</p>
          <Link to="/destinations" className="btn-primary mt-8 inline-flex">Kembali ke Destinasi</Link>
        </div>
      </section>
    );
  }

  return (
    <article className="relative bg-forest-950 pb-24">
      {/* Immersive Parallax Header */}
      <div className="relative h-[60vh] sm:h-[80vh] w-full overflow-hidden bg-forest-900">
        <motion.div 
          className="absolute inset-0 h-full w-full"
          style={{ y, opacity }}
        >
          <img 
            src={heroImage} 
            alt={destination.name} 
            className="h-full w-full object-cover object-center"
          />
          {/* Gradient Overlay for seamless blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        </motion.div>
        
        {/* Floating Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link to="/destinations" className="inline-flex h-10 items-center justify-center rounded-full bg-forest-950/50 backdrop-blur-md px-4 text-xs font-semibold text-forest-200 border border-forest-700/30 transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-forest-800 hover:scale-105 hover:-translate-y-0.5 active:scale-95">
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Main Content Layout (Split Screen) */}
      <div className="shell relative -mt-32 sm:-mt-48 z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Details & Gallery */}
          <div className="flex-1 lg:w-2/3">
            <ScrollReveal>
              {/* Header Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {cats.map((c) => (
                  <span key={c} className="pill bg-forest-800/80 border-forest-600/30 backdrop-blur-md">{c}</span>
                ))}
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                  destination.openStatus === 'open'
                    ? 'bg-forest-800/80 text-forest-300 border border-forest-500/30'
                    : 'bg-rose-900/80 text-rose-300 border border-rose-500/30'
                }`}>
                  {destination.openStatus === 'open' ? 'Buka' : 'Tutup'}
                </span>
                <span className="rounded-full bg-gold-900/60 px-3 py-1.5 text-xs font-bold font-mono text-gold-400 border border-gold-500/20 backdrop-blur-md">
                  ★ {destination.rating.toFixed(1)}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-forest-50 leading-tight">
                {destination.name}
              </h1>

              <div className="mt-8 prose prose-invert prose-forest max-w-none text-forest-300/90 leading-relaxed text-base sm:text-lg">
                <p>{destination.description}</p>
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span key={tag} className="text-sm font-medium text-forest-500 hover:text-forest-300 hover:translate-x-0.5 transition-[color,transform] duration-200 ease-out cursor-pointer inline-block">
                    #{tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            {/* Seamless Image Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-16 sm:mt-24">
                <ScrollReveal>
                  <h2 className="text-2xl font-bold text-forest-100 mb-6 font-display">Galeri Foto</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImages.map((img, i) => (
                      <motion.div
                        key={`${img}-${i}`}
                        layoutId={`gallery-image-${img}-${i}`}
                        className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
                        onClick={() => setActiveImage(`${img}-${i}`)}
                      >
                        <img 
                          src={img} 
                          alt="Gallery" 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/20 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            )}
            
            {/* Related */}
            <div className="mt-16 sm:mt-24 border-t border-forest-800/50 pt-16">
              <ScrollReveal>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-forest-100 font-display">Eksplorasi Serupa</h2>
                    <p className="mt-2 text-sm text-forest-500">Tempat lain yang mungkin Anda suka.</p>
                  </div>
                  <Link to="/destinations" className="btn-secondary text-xs hidden sm:inline-flex">
                    Semua destinasi
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:w-1/3 mt-12 lg:mt-0">
            <div className="sticky top-28 flex flex-col gap-6">
              
              {/* Action Card */}
              <ScrollReveal delay={0.2}>
                <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 text-forest-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-24 h-24 transform rotate-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                    </svg>
                  </div>
                  
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-500 mb-2">Estimasi Biaya</p>
                  <p className="text-3xl font-display font-bold text-gold-400 mb-6 font-mono">{formatCurrency(destination.price)}</p>
                  
                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-forest-600 mb-1">Hari Buka</span>
                      <span className="text-sm font-semibold text-forest-200">{openDays.length ? openDays.join(', ') : 'Belum tersedia'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-forest-600 mb-1">Kontak</span>
                      <span className="text-sm font-semibold text-forest-200">{destination.phone || 'Belum tersedia'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    <a href={destination.mapsUrl} target="_blank" rel="noreferrer" className="btn-primary w-full justify-center py-3">
                      Petunjuk Arah (Maps)
                    </a>
                    {destination.website && (
                      <a href={destination.website} target="_blank" rel="noreferrer" className="btn-secondary w-full justify-center py-3">
                        Kunjungi Situs Resmi
                      </a>
                    )}
                    <button type="button" onClick={handleFavoriteClick}
                      className={`w-full justify-center py-3 text-sm font-semibold rounded-2xl border transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                        isFavorite 
                          ? 'bg-rose-900/20 text-rose-400 border-rose-500/30 hover:bg-rose-900/40' 
                          : 'bg-forest-800/30 text-forest-300 border-forest-700/30 hover:bg-forest-800/50'
                      }`}>
                      {isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Small Map Card */}
              <ScrollReveal delay={0.3}>
                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-forest-700/20">
                    <p className="text-xs font-semibold text-forest-300 mb-1">Lokasi Presisi</p>
                    <p className="text-[11px] text-forest-500 line-clamp-2">{destination.address}</p>
                  </div>
                  <div className="h-48 w-full bg-forest-900">
                    <MapView destination={destination} />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Framer Motion Shared Element) */}
      <AnimatePresence>
        {activeImage && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-forest-950/95 backdrop-blur-xl"
              onClick={() => setActiveImage(null)}
            />
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-forest-800/50 text-forest-300 hover:text-white hover:scale-110 active:scale-90 transition-[color,background-color,transform] duration-200 ease-out border border-forest-700/30"
              onClick={() => setActiveImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </motion.button>
            {/* Image */}
            <motion.div 
              layoutId={`gallery-image-${activeImage}`}
              className="relative z-10 w-full max-w-5xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage.split('-')[0]} 
                alt="Enlarged gallery" 
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
}
