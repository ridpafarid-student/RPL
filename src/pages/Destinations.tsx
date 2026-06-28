import { useEffect, useMemo, useState, useRef } from 'react';
import DestinationCard from '@/components/DestinationCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import ScrollReveal from '@/components/ui/ScrollReveal';
import DestinationsMap from '@/components/DestinationsMap';
import { categories, destinations } from '@/data/destinations';
import { getPlaceSuggestions } from '@/services/geoapify';
import { usePageMeta } from '@/lib/use-page-meta';
import type { PlaceSuggestion } from '@/types';

const INITIAL_COUNT = 8;

const sortOptions = [
  { value: 'default', label: 'Urutan default' },
  { value: 'rating-desc', label: 'Rating tertinggi' },
  { value: 'price-asc', label: 'Harga termurah' },
  { value: 'price-desc', label: 'Harga termahal' },
  { value: 'name-asc', label: 'Nama A-Z' },
];

export default function Destinations() {
  usePageMeta('Eksplorasi Destinasi', 'Jelajahi daftar lengkap destinasi wisata Bogor dalam tampilan peta interaktif.');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredId(id);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setHoveredId(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) { setSuggestions([]); return; }
    const id = window.setTimeout(async () => {
      setSuggestions(await getPlaceSuggestions(trimmed));
    }, 350);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => { setShowAll(false); }, [category, query, sortBy]);

  const filtered = useMemo(() => {
    const result = destinations.filter((d) => {
      const nameMatch = d.name.toLowerCase().includes(query.trim().toLowerCase());
      const catMatch = category === 'All' || d.category.includes(category);
      return nameMatch && catMatch;
    });

    if (sortBy === 'rating-desc') return [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'id'));
    return result;
  }, [category, query, sortBy]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  // Toggle body scroll when mobile map is open
  useEffect(() => {
    if (showMobileMap) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showMobileMap]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row relative">
      {/* Left Panel: Content (Scrollable) */}
      <div className={`flex-1 px-4 pb-24 pt-20 sm:px-8 sm:pt-24 lg:w-[45%] xl:w-[40%] lg:flex-none ${showMobileMap ? 'hidden lg:block' : 'block'}`}>
        <ScrollReveal>
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-forest-50 sm:text-4xl">
              Daftar destinasi wisata Bogor
            </h1>
          </div>
        </ScrollReveal>

        {/* Filter Bar (Not Sticky) */}
        <div className="mt-8 flex flex-col gap-4">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            onSuggestionClick={(v) => { setQuery(v); setSuggestions([]); }}
          />
          <FilterBar categories={categories} category={category} onCategoryChange={setCategory} />
        </div>

        {/* Results info + sort */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-forest-700/20 pb-4">
          <p className="text-sm text-forest-500">
            Menampilkan <strong className="text-forest-300">{visible.length}</strong> dari{' '}
            <strong className="text-forest-300">{filtered.length}</strong> destinasi
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="sort-destinations" className="text-sm font-semibold text-forest-400">
              Urutkan
            </label>
            <select
              id="sort-destinations" value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input cursor-pointer py-2 text-xs"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-forest-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards grid (1 column on desktop to maximize width) */}
        {filtered.length > 0 ? (
          <>
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
              {visible.map((dest, i) => (
                <div
                  key={dest.id}
                  id={`card-${dest.id}`}
                  onMouseEnter={() => handleMouseEnter(dest.id)}
                  onMouseLeave={handleMouseLeave}
                  className="transition-all duration-700 ease-out border-2 border-transparent rounded-[2rem]"
                >
                  <ScrollReveal delay={i * 0.05}>
                    <DestinationCard destination={dest} />
                  </ScrollReveal>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button type="button" onClick={() => setShowAll((v) => !v)} className="btn-secondary">
                  {showAll ? 'Tampilkan lebih sedikit' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass-card mt-6 p-10 text-center">
            <h2 className="text-xl font-bold text-forest-200">Tidak ada yang cocok</h2>
            <p className="mt-2 text-sm text-forest-500">
              Coba ganti kata kunci atau hapus filter Anda.
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('All'); setSortBy('default'); }}
              className="btn-primary mt-6"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Sticky Map (Desktop & Mobile when toggled) */}
      <div className={`
        ${showMobileMap ? 'fixed inset-0 z-40 pt-[72px]' : 'hidden'} 
        lg:block lg:flex-1 lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:pt-0 border-l border-forest-700/30 bg-forest-950
      `}>
        <DestinationsMap
          destinations={visible}
          activeId={hoveredId}
          onMarkerClick={(id) => {
            const cardEl = document.getElementById(`card-${id}`);
            if (cardEl && !showMobileMap) { // Only scroll on desktop
              cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              cardEl.classList.add('border-gold-400', 'scale-[1.02]', 'shadow-[0_0_40px_-10px_rgba(232,197,71,0.5)]');
              setTimeout(() => {
                cardEl.classList.remove('border-gold-400', 'scale-[1.02]', 'shadow-[0_0_40px_-10px_rgba(232,197,71,0.5)]');
              }, 2000);
            }
          }}
        />
      </div>

      {/* Mobile FAB Toggle */}
      <button
        type="button"
        onClick={() => setShowMobileMap(!showMobileMap)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden flex items-center gap-2 rounded-full bg-forest-100 px-6 py-3 text-sm font-bold text-forest-950 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95"
      >
        {showMobileMap ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Tampilkan Daftar
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            Tampilkan Peta
          </>
        )}
      </button>
    </div>
  );
}
