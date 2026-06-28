import { useMemo, useState } from 'react';
import DestinationCard from '@/components/DestinationCard';
import FilterBar from '@/components/FilterBar';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { categories, destinations } from '@/data/destinations';
import { getTopRecommendations } from '@/utils/scoring';
import { usePageMeta } from '@/lib/use-page-meta';

export default function Recommendations() {
  usePageMeta('Rekomendasi', 'Temukan rekomendasi destinasi Bogor terbaik berdasarkan preferensi kategori dan budget Anda.');

  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('all');
  const [submittedPref, setSubmittedPref] = useState({ category: 'All', budget: 'all' });

  const recommendations = useMemo(() => {
    return getTopRecommendations(
      destinations,
      {
        category: submittedPref.category,
        budget: submittedPref.budget,
        preferredTags:
          submittedPref.category === 'Nature' ? ['alam', 'sejuk', 'foto']
            : submittedPref.category === 'Family' ? ['keluarga', 'foto', 'bogor']
            : submittedPref.category === 'Education' ? ['edukasi', 'bogor', 'foto']
            : ['foto', 'bogor', 'sejuk'],
      },
      6
    );
  }, [submittedPref]);

  return (
    <section className="shell pb-28 pt-28 sm:pt-32 sm:pb-16">
      <ScrollReveal>
        <div className="max-w-3xl">
          <p className="section-eyebrow">Smart Suggestions</p>
          <h1 className="section-title mt-3 text-balance">Halaman rekomendasi wisata</h1>
          <p className="section-copy">
            Pilih kategori dan budget Anda. Sistem akan memberikan rekomendasi terbaik
            berdasarkan kecocokan harga, rating, dan aktivitas yang sesuai dengan preferensi Anda.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <form
          className="glass-card mt-8 p-6 sm:p-8 flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedPref({ category, budget });
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
          <div className="flex justify-end pt-4 border-t border-forest-700/20">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Tampilkan rekomendasi cerdas
            </button>
          </div>
        </form>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-forest-400">Filter Aktif:</span>
          <span className="pill border-forest-500/30">
            Kategori: <strong className="text-forest-100">{submittedPref.category}</strong>
          </span>
          <span className="pill border-forest-500/30">
            Budget: <strong className="text-forest-100">
              {submittedPref.budget === 'all' ? 'Semua' : submittedPref.budget === 'budget' ? 'Hemat' : submittedPref.budget === 'mid' ? 'Menengah' : 'Premium'}
            </strong>
          </span>
        </div>
      </ScrollReveal>

      {recommendations.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((dest, i) => (
            <ScrollReveal key={dest.id} delay={i * 0.1}>
              <DestinationCard destination={dest} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal delay={0.4}>
          <div className="glass-card mt-8 p-10 text-center">
            <h2 className="text-xl font-bold text-forest-200">Tidak ada rekomendasi yang cocok</h2>
            <p className="mt-2 text-sm text-forest-500">Coba ubah kombinasi kategori dan budget Anda.</p>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
