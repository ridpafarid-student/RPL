const STORAGE_KEY = 'bogortrip:favorites';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
}

export function getFavorites() {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  const parsedValue = safeParse(rawValue);
  return Array.isArray(parsedValue) ? parsedValue : [];
}

export function addFavorite(item) {
  const favorites = getFavorites();

  if (favorites.some((favorite) => favorite.id === item.id)) {
    return favorites;
  }

  const nextFavorites = [...favorites, item];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
  return nextFavorites;
}

export function removeFavorite(id) {
  const favorites = getFavorites();
  const nextFavorites = favorites.filter((favorite) => favorite.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
  return nextFavorites;
}

export function isFavorite(id) {
  return getFavorites().some((favorite) => favorite.id === id);
}
