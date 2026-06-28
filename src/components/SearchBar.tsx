import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
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
    </div>
  );
}
