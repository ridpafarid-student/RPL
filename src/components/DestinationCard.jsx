import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import {
  addFavorite,
  isFavorite as checkFavorite,
  removeFavorite,
} from '../utils/favoriteStorage';

function DestinationCard({ destination, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const images = useMemo(() => {
    if (Array.isArray(destination.photos) && destination.photos.length > 0) {
      return destination.photos;
    }

    return [
      destination.image,
      destination.photoUrl,
      destination.fotoUrl,
    ].filter(Boolean);
  }, [destination]);

  const categories = Array.isArray(destination.category)
    ? destination.category
    : [destination.category].filter(Boolean);

  useEffect(() => {
    setIsFavorite(checkFavorite(destination.id));
  }, [destination.id]);

  const handleFavoriteClick = () => {
    if (checkFavorite(destination.id)) {
      removeFavorite(destination.id);
      setIsFavorite(false);
    } else {
      addFavorite(destination);
      setIsFavorite(true);
    }

    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <article className="surface-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <ImageCarousel
          images={images}
          alt={destination.name}
          heightClass="h-56"
          roundedClass="rounded-none"
          autoPlay
          autoPlayInterval={3200}
          showDots
          showCounter
        />

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:scale-105 hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            className={isFavorite ? 'h-5 w-5 text-rose-500' : 'h-5 w-5'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s-6.716-4.35-9.193-8.475C.87 9.308 2.037 5.25 5.784 4.187c2.241-.635 4.004.11 5.216 1.695 1.212-1.585 2.975-2.33 5.216-1.695 3.747 1.063 4.914 5.121 2.977 8.338C18.716 16.65 12 21 12 21z"
            />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 2).map((category) => (
              <span key={category} className="pill">
                {category}
              </span>
            ))}
          </div>

          <span className="text-sm font-semibold text-amber-500">
            {destination.rating.toFixed(1)} / 10
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
          {destination.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {destination.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {destination.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Mulai dari
            </p>
            <p className="text-lg font-extrabold text-slate-900">
              Rp{destination.price.toLocaleString('id-ID')}
            </p>
          </div>

          <Link
            to={`/destinations/${destination.id}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;