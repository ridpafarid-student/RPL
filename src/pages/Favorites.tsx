import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DestinationCard from '@/components/DestinationCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getFavorites } from '@/utils/favoriteStorage';
import { usePageMeta } from '@/lib/use-page-meta';
import type { Destination } from '@/types';

export default function Favorites() {
  usePageMeta('Destinasi Favorit', 'Daftar destinasi wisata Bogor yang telah Anda simpan.');

  const [favorites, setFavorites] = useState<Destination[]>([]);

  const loadFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    loadFavorites();
    const handleStorage = () => loadFavorites();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadFavorites]);

  return (
    <section className="shell pb-28 pt-28 sm:pt-32 sm:pb-16 min-h-[70vh]">
      <ScrollReveal>
        <div className="max-w-3xl">
          <p className="section-eyebrow">Saved Places</p>
          <h1 className="section-title mt-3">Destinasi favorit Anda</h1>
          <p className="section-copy">
            Semua tempat menarik yang telah Anda simpan dikumpulkan di sini
            untuk memudahkan perencanaan perjalanan Anda selanjutnya.
          </p>
        </div>
      </ScrollReveal>

      {favorites.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((dest, i) => (
            <ScrollReveal key={dest.id} delay={i * 0.1}>
              <DestinationCard destination={dest} onFavoriteChange={loadFavorites} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal delay={0.2}>
          <div className="glass-card mt-10 p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-800/50 text-forest-500 mb-6 border border-forest-700/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-forest-100">Belum ada favorit yang disimpan</h2>
            <p className="mt-3 text-sm leading-7 text-forest-400/80 max-w-md">
              Jelajahi daftar destinasi kami dan klik ikon hati untuk menyimpan tempat
              yang ingin Anda kunjungi.
            </p>
            <Link to="/destinations" className="btn-primary mt-8">
              Mulai Jelajah
            </Link>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
