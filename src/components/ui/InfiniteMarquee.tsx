import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const defaultWords = [
  'BOGORNESIA', '•',
  'KOTA HUJAN', '•',
  'KEBUN RAYA', '•',
  'GUNUNG SALAK', '•',
  'PUNCAK BOGOR', '•',
  'TUGU KUJANG', '•',
  'WISATA ALAM', '•',
  'KULINER KHAS', '•'
];

export default function InfiniteMarquee({ words = defaultWords }: { words?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative flex w-full overflow-hidden border-y border-forest-700/30 bg-forest-900/50 py-3 sm:py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={isVisible ? { x: ['0%', '-50%'] } : undefined}
        transition={{
          ease: 'linear',
          duration: 35, // Slightly slower scroll speed for better legibility
          repeat: Infinity,
        }}
      >
        {[...words, ...words].map((word, i) => {
          const isDivider = word === '•';
          const isBrand = word === 'BOGORNESIA';
          const isHighlight = word === 'KOTA HUJAN' || word === 'KEBUN RAYA';

          if (isDivider) {
            return (
              <span key={i} className="mx-4 inline-block text-lg sm:text-2xl font-black text-gold-500/40 animate-pulse select-none">
                •
              </span>
            );
          }

          if (isBrand) {
            return (
              <span key={i} className="mx-4 inline-block font-display text-lg sm:text-2xl font-extrabold uppercase tracking-widest text-gold-400 drop-shadow-[0_0_20px_rgba(212,168,67,0.25)]">
                {word}
              </span>
            );
          }

          if (isHighlight) {
            return (
              <span key={i} className="mx-4 inline-block font-display text-lg sm:text-2xl font-extrabold uppercase tracking-widest text-forest-100">
                {word}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="mx-4 inline-block font-display text-lg sm:text-2xl font-semibold uppercase tracking-widest text-transparent select-none"
              style={{ WebkitTextStroke: '1px rgba(250, 250, 250, 0.15)' }}
            >
              {word}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
