import { useEffect, useMemo, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import { categories, destinations } from '../data/destinations';
import { getPlaceSuggestions } from '../services/geoapify';

const INITIAL_DESTINATION_COUNT = 6;

const sortOptions = [
  { value: 'default', label: 'Urutan default' },
  { value: 'rating-desc', label: 'Rating tertinggi' },
  { value: 'price-asc', label: 'Harga termurah' },
  { value: 'price-desc', label: 'Harga termahal' },
  { value: 'name-asc', label: 'Nama A-Z' },
];

function Destinations() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [suggestions, setSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      const nextSuggestions = await getPlaceSuggestions(trimmedQuery);
      setSuggestions(nextSuggestions);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    setShowAllDestinations(false);
  }, [category, query, sortBy]);

  const filteredDestinations = useMemo(() => {
    const result = destinations.filter((destination) => {
      const matchedName = destination.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchedCategory =
        category === 'All' || destination.category.includes(category);

      return matchedName && matchedCategory;
    });

    if (sortBy === 'rating-desc') {
      return [...result].sort((first, second) => second.rating - first.rating);
    }

    if (sortBy === 'price-asc') {
      return [...result].sort((first, second) => first.price - second.price);
    }

    if (sortBy === 'price-desc') {
      return [...result].sort((first, second) => second.price - first.price);
    }

    if (sortBy === 'name-asc') {
      return [...result].sort((first, second) =>
        first.name.localeCompare(second.name, 'id')
      );
    }

    return result;
  }, [category, query, sortBy]);

  const visibleDestinations = showAllDestinations
    ? filteredDestinations
    : filteredDestinations.slice(0, INITIAL_DESTINATION_COUNT);
  const hasMoreDestinations = filteredDestinations.length > INITIAL_DESTINATION_COUNT;

  return (
    <section className="shell py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Destination Directory
        </p>
        <h1 className="section-title mt-2">Daftar destinasi wisata Bogor</h1>
        <p className="section-copy">
          Cari berdasarkan nama, lalu saring berdasarkan kategori agar pengguna
          lebih cepat menemukan tempat yang cocok.
        </p>
      </div>

      <div className="surface-card mt-8 grid gap-5 p-5 md:grid-cols-[1.3fr_0.9fr]">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          onSuggestionClick={(value) => {
            setQuery(value);
            setSuggestions([]);
          }}
        />
        <FilterBar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Menampilkan <strong>{visibleDestinations.length}</strong> dari{' '}
          <strong>{filteredDestinations.length}</strong> destinasi
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-destinations"
              className="text-sm font-semibold text-slate-600"
            >
              Urutkan
            </label>
            <select
              id="sort-destinations"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 outline-none transition focus:border-emerald-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {query || category !== 'All' || sortBy !== 'default' ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setSuggestions([]);
                setSortBy('default');
              }}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-stone-100"
            >
              Reset filter
            </button>
          ) : null}
        </div>
      </div>

      {filteredDestinations.length > 0 ? (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {visibleDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          {hasMoreDestinations ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllDestinations((currentValue) => !currentValue)}
                className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
              >
                {showAllDestinations ? 'Tampilkan lebih sedikit' : 'Lihat semua destinasi'}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="surface-card mt-6 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Destinasi tidak ditemukan</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Coba ganti kata kunci atau pilih kategori lain.
          </p>
        </div>
      )}
    </section>
  );
}

export default Destinations;
