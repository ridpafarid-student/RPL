import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TreePine,
  PawPrint,
  Camera,
  Flower2,
  Waves,
  ArrowRight,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { destinations } from '@/data/destinations';
import ScrollReveal from './ui/ScrollReveal';

/* ─── Icon mapping by primary category ──────────────────── */
const iconMap: Record<string, LucideIcon> = {
  Nature: TreePine,
  Family: PawPrint,
  Education: Camera,
  'Theme Park': Flower2,
  'Water Park': Waves,
  Museum: Camera,
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const TRANSITION_MS = 700;

export default function RecommendationSection() {
  const topDestinations = useMemo(() => {
    const curatedIds = [
      'halimun-salak',
      'curug-cikuluwung',
      'taman-bunga-nusantara',
      'curug-bidadari-sentul',
      'cimory-dairyland-megamendung',
    ];
    return curatedIds
      .map(id => destinations.find(d => d.id === id))
      .filter((d): d is typeof destinations[number] => d !== undefined);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [entered, setEntered] = useState(false);

  /* ── Staggered entrance animation ─────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* ── Panel click handler ──────────────────────────────── */
  const handlePanelClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);

    // On mobile, scroll the clicked panel into view
    if (window.innerWidth < 768) {
      const el = document.getElementById(`top-pick-panel-${index}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  /* ── Image helper ─────────────────────────────────────── */
  const getImage = (dest: (typeof topDestinations)[number]) => {
    const photos = Array.isArray(dest.photos) && dest.photos.length > 0 ? dest.photos : [];
    return (
      photos[0] ||
      dest.photoUrl ||
      'https://images.unsplash.com/photo-1555696958-c5049b866f6f?auto=format&fit=crop&w=800&q=80'
    );
  };

  return (
    <section className="py-16 sm:py-24 overflow-hidden bg-forest-950 relative z-10">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="shell mb-10">
        <ScrollReveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Top Picks</p>
              <h2 className="section-title mt-3 text-balance">
                Rekomendasi unggulan untuk mulai menjelajah
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/recommendations" className="btn-primary text-xs">
                Halaman Rekomendasi
              </Link>
              <Link to="/destinations" className="btn-secondary text-xs">
                Semua Destinasi
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Interactive Expanding Panels ─────────────────── */}
      <div className="shell">
        <div className="flex w-full h-[340px] sm:h-[400px] md:h-[460px] overflow-x-auto md:overflow-visible scrollbar-hide">
          {topDestinations.map((dest, index) => {
            const isActive = activeIndex === index;
            const Icon = iconMap[dest.category[0]] || Camera;
            const imgSrc = getImage(dest);
            const staggerDelay = index * 0.15;

            return (
              <motion.div
                key={dest.id}
                id={`top-pick-panel-${index}`}
                layout
                transition={{
                  layout: { type: 'tween', duration: TRANSITION_MS / 1000, ease: EASE_OUT_EXPO },
                }}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer border-2 border-forest-700/40 bg-forest-950"
                style={{
                  flex: isActive ? '7 1 0%' : '1 1 0%',
                  minWidth: isActive ? undefined : '56px',
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'translateY(0)' : 'translateY(24px)',
                  transition: entered
                    ? `opacity ${TRANSITION_MS}ms cubic-bezier(${EASE_OUT_EXPO}), transform ${TRANSITION_MS}ms cubic-bezier(${EASE_OUT_EXPO}), flex-grow ${TRANSITION_MS}ms cubic-bezier(${EASE_OUT_EXPO}), border-color 300ms ease-out`
                    : 'none',
                  transitionDelay: entered ? `${staggerDelay}s, ${staggerDelay}s, 0s, 0s` : '0s',
                  willChange: entered ? 'flex-grow' : undefined,
                }}
                onClick={() => handlePanelClick(index)}
              >
                {/* ── Background Image (GPU-accelerated zoom) ── */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={dest.name}
                    loading="lazy"
                    className="h-full w-full object-cover transform-gpu transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                </div>

                {/* ── Gradient overlay ──────────────────────── */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(6,18,16,0.92), rgba(6,18,16,0.45) 50%, transparent 80%)',
                  }}
                />

                {/* ── Inactive: Vertical title hint ─────────── */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
                    <span className="text-sm font-bold text-forest-100/80 tracking-wider whitespace-nowrap [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
                      {dest.name}
                    </span>
                  </div>
                )}

                {/* ── Active: Full content ──────────────────── */}
                {isActive && (
                  <div className="relative flex flex-col justify-end h-full p-5 sm:p-6 md:p-8 z-10">
                    {/* Category pill */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-2 mb-3"
                    >
                      <span className="rounded-full bg-forest-800/80 px-3 py-1 text-[10px] font-semibold text-forest-200 border border-forest-600/30 shadow-sm">
                        {dest.category[0]}
                      </span>
                      {dest.category[1] && (
                        <span className="rounded-full bg-forest-800/80 px-3 py-1 text-[10px] font-semibold text-forest-200 border border-forest-600/30 shadow-sm">
                          {dest.category[1]}
                        </span>
                      )}
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT_EXPO }}
                      className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-forest-50 leading-tight"
                    >
                      {dest.name}
                    </motion.h3>

                    {/* Rating & tag */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.2, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-2 mt-2"
                    >
                      <span className="flex items-center gap-1 text-sm font-semibold text-gold-400">
                        <Star className="h-4 w-4 fill-gold-400" />
                        {dest.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-forest-300 font-medium">
                        &bull; {dest.tags[0]}
                      </span>
                      <span className="text-sm text-forest-400">
                        &bull; {dest.reviewCount.toLocaleString('id-ID')} ulasan
                      </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT_EXPO }}
                      className="text-sm text-forest-100/80 mt-3 line-clamp-2 leading-relaxed max-w-lg"
                    >
                      {dest.description}
                    </motion.p>

                    {/* Price + CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-4 mt-5"
                    >
                      <Link
                        to={`/destinations/${dest.id}`}
                        className="flex items-center gap-2 rounded-xl bg-forest-50 px-5 py-2.5 text-sm font-bold text-forest-950 transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-gold-400 hover:scale-105 active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Jelajahi <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="text-sm text-forest-300 font-medium">
                        Mulai Rp{dest.price.toLocaleString('id-ID')}
                      </span>
                    </motion.div>
                  </div>
                )}

                {/* ── Bottom icon strip (always visible) ──── */}
                <div
                  className="absolute bottom-3 left-3 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-forest-950/70 border border-forest-600/40 flex-shrink-0 transition-colors duration-300"
                  style={{ borderColor: isActive ? 'rgba(232,197,71,0.5)' : undefined }}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-forest-300'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Navigation dots / panel indicators ─────────── */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {topDestinations.map((dest, index) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative flex items-center gap-2 py-1.5 px-1"
              aria-label={`Select ${dest.name}`}
            >
              <span
                className={`block h-1 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeIndex === index
                    ? 'w-8 bg-gold-400'
                    : 'w-2 bg-forest-600 group-hover:bg-forest-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
