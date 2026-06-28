import type { Destination } from '@/types';

const STORAGE_KEY = 'bogornesia:favorites';

function safeParse(value: string): Destination[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getFavorites(): Destination[] {
  if (typeof window === 'undefined') return [];

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return [];

  return safeParse(rawValue);
}

export function addFavorite(item: Destination): Destination[] {
  const favorites = getFavorites();
  if (favorites.some((fav) => fav.id === item.id)) return favorites;

  const next = [...favorites, item];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeFavorite(id: string): Destination[] {
  const favorites = getFavorites();
  const next = favorites.filter((fav) => fav.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((fav) => fav.id === id);
}
