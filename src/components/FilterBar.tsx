const budgetOptions = [
  { value: 'all', label: 'Semua budget' },
  { value: 'budget', label: 'Hemat (< Rp50.000)' },
  { value: 'mid', label: 'Sedang (Rp50.000 - Rp100.000)' },
  { value: 'premium', label: 'Premium (> Rp100.000)' },
];

interface FilterBarProps {
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  budget?: string;
  onBudgetChange?: (value: string) => void;
  showBudget?: boolean;
}

export default function FilterBar({
  categories,
  category,
  onCategoryChange,
  budget = 'all',
  onBudgetChange = () => {},
  showBudget = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-forest-300">
        Filter kategori
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((item) => {
          const isActive = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${
                isActive
                  ? 'bg-forest-500 text-forest-50 border-forest-400 shadow-lg shadow-forest-500/20'
                  : 'bg-forest-800/40 text-forest-300 border-forest-700/30 hover:bg-forest-700/50 hover:text-forest-100'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {showBudget && (
        <div className="mt-2">
          <label htmlFor="budget-filter" className="mb-2 block text-sm font-semibold text-forest-300">
            Pilih budget
          </label>
          <select
            id="budget-filter"
            value={budget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="glass-input cursor-pointer"
          >
            {budgetOptions.map((item) => (
              <option key={item.value} value={item.value} className="bg-forest-900 text-forest-200">
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
