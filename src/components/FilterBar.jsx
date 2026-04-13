const budgetOptions = [
  { value: 'all', label: 'Semua budget' },
  { value: 'budget', label: 'Hemat (< Rp50.000)' },
  { value: 'mid', label: 'Sedang (Rp50.000 - Rp100.000)' },
  { value: 'premium', label: 'Premium (> Rp100.000)' },
];

function FilterBar({
  categories,
  category,
  onCategoryChange,
  budget = 'all',
  onBudgetChange = () => {},
  showBudget = false,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div>
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Filter kategori
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {showBudget ? (
        <div>
          <label
            htmlFor="budget-filter"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Pilih budget
          </label>
          <select
            id="budget-filter"
            value={budget}
            onChange={(event) => onBudgetChange(event.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {budgetOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default FilterBar;
