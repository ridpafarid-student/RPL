import { Link } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { getTopRecommendations } from '../utils/scoring';
import DestinationCard from './DestinationCard';

function RecommendationSection() {
  const topDestinations = getTopRecommendations(
    destinations,
    {
      category: 'Nature',
      budget: 'all',
      preferredTags: ['alam', 'sejuk', 'foto'],
    },
    3
  );

  return (
    <section className="shell py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Top Picks
          </p>
          <h2 className="section-title mt-2">Rekomendasi unggulan untuk mulai menjelajah</h2>
          <p className="section-copy">
            Pilihan ini disusun dari kecocokan kategori, rating, harga, dan tag
            yang benar-benar ada di data destinasi Bogor.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/recommendations"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            Buka halaman rekomendasi
          </Link>
          <Link
            to="/destinations"
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
          >
            Lihat semua destinasi
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {topDestinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}

export default RecommendationSection;
