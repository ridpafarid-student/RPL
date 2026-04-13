import { useCallback, useEffect, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import { getFavorites } from '../utils/favoriteStorage';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

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
    <section className="shell py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Saved Places
        </p>
        <h1 className="section-title mt-2">Destinasi favorit</h1>
        <p className="section-copy">
          Semua tempat yang kamu simpan akan tampil di sini melalui localStorage.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {favorites.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onFavoriteChange={loadFavorites}
            />
          ))}
        </div>
      ) : (
        <div className="surface-card mt-8 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Belum ada favorit</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Tambahkan destinasi dari halaman daftar atau detail untuk melihatnya
            di sini.
          </p>
        </div>
      )}
    </section>
  );
}

export default Favorites;
