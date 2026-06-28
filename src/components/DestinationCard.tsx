import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Destination } from '@/types';
import {
  addFavorite,
  isFavorite as checkFavorite,
  removeFavorite,
} from '@/utils/favoriteStorage';
import { ArrowRight, Star } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onFavoriteChange?: () => void;
}

const DestinationCard = ({ destination, onFavoriteChange }: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const images = useMemo(() => {
    if (Array.isArray(destination.photos) && destination.photos.length > 0) {
      return destination.photos;
    }
    return [destination.image, destination.photoUrl, destination.fotoUrl].filter(Boolean) as string[];
  }, [destination]);

  const mainImage = images[0] || 'https://images.unsplash.com/photo-1555696958-c5049b866f6f?auto=format&fit=crop&q=80';

  const categories = Array.isArray(destination.category)
    ? destination.category
    : [destination.category].filter(Boolean);

  useEffect(() => {
    setIsFavorite(checkFavorite(destination.id));
  }, [destination.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (checkFavorite(destination.id)) {
      removeFavorite(destination.id);
      setIsFavorite(false);
    } else {
      addFavorite(destination);
      setIsFavorite(true);
    }
    onFavoriteChange?.();
  };

  return (
    <article className="group relative w-full h-[420px] overflow-hidden rounded-3xl border border-forest-700/30 bg-forest-950 shadow-lg transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1.5">
      {/* Background Image with Zoom Effect on Hover */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={mainImage}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ backfaceVisibility: 'hidden' }}
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent"></div>

      {/* Content Container */}
      <div className="relative flex h-full flex-col justify-between p-6">
        {/* Top Section: Favorite */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-forest-50/20 bg-forest-950/60 transition-[background-color,transform] duration-300 hover:scale-110 hover:bg-forest-900/80"
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              className={`h-5 w-5 transition-[color,transform] duration-300 ${isFavorite ? 'text-rose-400 scale-110' : 'text-forest-50'
                }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              />
            </svg>
          </button>
        </div>

        {/* Middle Section: Details (slides up on hover) */}
        <div className="space-y-3 transition-transform duration-300 ease-out group-hover:-translate-y-12">
          <div className="flex gap-2 mb-2">
            {categories.slice(0, 2).map((cat) => (
              <span key={cat} className="rounded-full bg-forest-800/80 px-3 py-1 text-[10px] font-medium text-forest-200 border border-forest-600/30 shadow-sm">
                {cat}
              </span>
            ))}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-forest-50 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
              {destination.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm font-semibold text-gold-400">
                <Star className="h-4 w-4 fill-gold-400" />
                {destination.rating.toFixed(1)}
              </span>
              <span className="text-sm text-forest-200 font-medium">• {destination.tags[0]}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-forest-100/90 leading-relaxed line-clamp-2">
              {destination.description}
            </p>
          </div>
        </div>

        {/* Bottom Section: Price and Button (revealed on hover) */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-end justify-between border-t border-forest-50/20 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-forest-300 font-bold mb-1">Mulai dari</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-bold text-forest-50">Rp{destination.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <Link
              to={`/destinations/${destination.id}`}
              className="flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-bold text-forest-950 transition-[background-color,transform] duration-300 hover:bg-gold-400 hover:scale-105"
            >
              Jelajahi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default React.memo(DestinationCard);
