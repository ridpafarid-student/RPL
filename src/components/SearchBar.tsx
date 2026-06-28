import type { PlaceSuggestion } from '@/types';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions?: PlaceSuggestion[];
  onSuggestionClick: (name: string) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  suggestions = [],
  onSuggestionClick,
}: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="destination-search" className="mb-2 block text-sm font-semibold text-forest-300">
        Cari destinasi
      </label>
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
        <input
          id="destination-search"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Contoh: Kebun Raya Bogor"
          className="glass-input pl-11 w-full"
        />
      </div>

      {query.trim().length >= 3 && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-2xl
          border border-forest-700/20 bg-forest-900/95 p-2 shadow-xl backdrop-blur-xl">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition-[background-color,transform] duration-200 ease-out hover:bg-forest-800/50 active:scale-[0.98]"
              onClick={() => onSuggestionClick(s.name)}
            >
              <span className="text-sm font-semibold text-forest-200">{s.name}</span>
              <span className="text-xs text-forest-500">{s.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
