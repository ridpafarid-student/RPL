import { useMemo, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import { categories, destinations } from '../data/destinations';
import { getTopRecommendations } from '../utils/scoring';

function Recommendations() {
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('all');
  const [submittedPreference, setSubmittedPreference] = useState({
    category: 'All',
    budget: 'all',
  });

  const recommendations = useMemo(() => {
    return getTopRecommendations(
      destinations,
      {
        category: submittedPreference.category,
        budget: submittedPreference.budget,
        preferredTags:
          submittedPreference.category === 'Nature'
            ? ['alam', 'sejuk', 'foto']
            : submittedPreference.category === 'Family'
              ? ['keluarga', 'foto', 'bogor']
              : submittedPreference.category === 'Education'
                ? ['edukasi', 'bogor', 'foto']
                : ['foto', 'bogor', 'sejuk'],
      },
      6
    );
  }, [submittedPreference]);

  return (
    <section className="shell py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Smart Suggestions
        </p>
        <h1 className="section-title mt-2">Halaman rekomendasi wisata</h1>
        <p className="section-copy">
          Isi kategori dan budget, lalu sistem akan memberi skor sederhana
          berdasarkan kecocokan kategori, rating, harga, dan tag destinasi.
        </p>
      </div>

      <form
        className="surface-card mt-8 space-y-5 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedPreference({ category, budget });
        }}
      >
        <FilterBar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          budget={budget}
          onBudgetChange={setBudget}
          showBudget
        />
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Tampilkan rekomendasi
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
        <span className="rounded-full bg-stone-100 px-4 py-2">
          Kategori: <strong>{submittedPreference.category}</strong>
        </span>
        <span className="rounded-full bg-stone-100 px-4 py-2">
          Budget: <strong>{submittedPreference.budget}</strong>
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {recommendations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}

export default Recommendations;
