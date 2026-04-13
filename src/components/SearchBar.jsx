function SearchBar({
  query,
  onQueryChange,
  suggestions = [],
  onSuggestionClick,
}) {
  return (
    <div className="relative">
      <label
        htmlFor="destination-search"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Cari destinasi
      </label>
      <input
        id="destination-search"
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Contoh: Kebun Raya Bogor"
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />

      {query.trim().length >= 3 && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-200/70">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-stone-50"
              onClick={() => onSuggestionClick(suggestion.name)}
            >
              <span className="text-sm font-semibold text-slate-800">
                {suggestion.name}
              </span>
              <span className="text-xs text-slate-500">
                {suggestion.address || 'Bogor, Jawa Barat'}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
