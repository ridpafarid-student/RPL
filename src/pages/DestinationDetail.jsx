import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import MapView from '../components/MapView';
import { destinations } from '../data/destinations';
import {
  addFavorite,
  isFavorite as checkFavorite,
  removeFavorite,
} from '../utils/favoriteStorage';

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return 'Hubungi pengelola';
  }

  if (value <= 0) {
    return 'Gratis';
  }

  return `Rp${value.toLocaleString('id-ID')}`;
}

function formatText(value, fallback = 'Belum tersedia') {
  if (!value) {
    return fallback;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue || fallback;
}

function DestinationDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const destination = useMemo(
    () => destinations.find((item) => item.id === id),
    [id]
  );
  const destinationImage =
    destination?.image ?? destination?.photoUrl ?? destination?.fotoUrl;
  const destinationCategories = Array.isArray(destination?.category)
    ? destination.category
    : [destination?.category].filter(Boolean);
  const openingDays = useMemo(() => {
    if (!destination?.openingHours?.length) {
      return [];
    }

    return [...destination.openingHours].sort(
      (firstDay, secondDay) => dayOrder.indexOf(firstDay) - dayOrder.indexOf(secondDay)
    );
  }, [destination]);
  const relatedDestinations = useMemo(() => {
    if (!destination) {
      return [];
    }

    return destinations
      .filter((item) => item.id !== destination.id)
      .filter((item) =>
        item.category.some((category) => destination.category.includes(category))
      )
      .sort((first, second) => second.rating - first.rating)
      .slice(0, 3);
  }, [destination]);

  useEffect(() => {
    if (!destination) {
      return;
    }

    setIsFavorite(checkFavorite(destination.id));
  }, [destination]);

  const handleFavoriteClick = () => {
    if (!destination) {
      return;
    }

    if (checkFavorite(destination.id)) {
      removeFavorite(destination.id);
      setIsFavorite(false);
      return;
    }

    addFavorite(destination);
    setIsFavorite(true);
  };

  if (!destination) {
    return (
      <section className="shell py-14">
        <div className="surface-card p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Destinasi tidak ditemukan
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Pastikan URL benar atau kembali ke daftar destinasi.
          </p>
          <Link
            to="/destinations"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Kembali ke destinasi
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-10 sm:py-14">
      <Link
        to="/destinations"
        className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-stone-100"
      >
        Kembali ke daftar
      </Link>

      <div className="mt-6 space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            {destinationImage ? (
              <img
                src={destinationImage}
                alt={destination.name}
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            ) : (
              <div className="flex h-[320px] w-full items-end bg-gradient-to-br from-emerald-200 via-teal-100 to-cyan-100 p-6 sm:h-[420px] sm:p-8">
                <div className="max-w-sm rounded-[1.5rem] bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Destination Detail
                  </p>
                  <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {destination.name}
                  </h1>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Foto belum tersedia, tapi semua informasi destinasi tetap bisa kamu lihat di bawah.
                  </p>
                </div>
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                {destinationCategories.map((category) => (
                  <span key={category} className="pill">
                    {category}
                  </span>
                ))}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    destination.openStatus === 'open'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {destination.openStatus === 'open' ? 'Sedang buka' : 'Tutup'}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  Rating {destination.rating.toFixed(1)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {destination.reviewCount.toLocaleString('id-ID')} ulasan
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {destination.name}
              </h1>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                {destination.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Alamat
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatText(destination.address)}
                  </p>
                </div>
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Harga tiket
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatCurrency(destination.price)}
                  </p>
                </div>
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Hari operasional
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {openingDays.length ? openingDays.join(', ') : 'Jadwal belum tersedia'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Website
                  </p>
                  {destination.website ? (
                    <a
                      href={destination.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                    >
                      Kunjungi situs resmi
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-slate-700">Belum tersedia</p>
                  )}
                </div>
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Kontak
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatText(destination.phone)}
                  </p>
                </div>
                <div className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Koordinat
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {destination.location.lat}, {destination.location.lng}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <a
                  href={destination.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Buka di Google Maps
                </a>
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'border border-stone-200 bg-white text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lokasi di peta</h2>
            <p className="mt-2 text-sm text-slate-500">
              Marker akan tampil sesuai koordinat destinasi.
            </p>
            <div className="mt-5">
              <MapView destination={destination} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Destinasi terkait</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Saya tampilkan beberapa rekomendasi serupa agar halaman tetap ringkas.
                </p>
              </div>
              <Link
                to="/destinations"
                className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
              >
                Lihat semua destinasi
              </Link>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {relatedDestinations.map((item) => (
                <DestinationCard key={item.id} destination={item} />
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}

export default DestinationDetail;
