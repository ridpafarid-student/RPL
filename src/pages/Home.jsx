import Hero from '../components/Hero';
import RecommendationSection from '../components/RecommendationSection';

function Home() {
  return (
    <>
      <Hero />

      <section className="shell py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="surface-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Alam Sejuk
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              Bogor cocok untuk wisata santai
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Kota Bogor terkenal dengan udara yang lebih sejuk, ruang hijau
              yang luas, serta pilihan wisata alam yang cocok untuk healing dan
              liburan singkat.
            </p>
          </article>

          <article className="surface-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Wisata Keluarga
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              Banyak pilihan tempat seru
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Mulai dari kebun raya, taman bermain, museum, hingga waterpark,
              Bogor punya banyak destinasi yang cocok untuk keluarga, pelajar,
              dan wisatawan umum.
            </p>
          </article>

          <article className="surface-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Mudah Dijangkau
            </p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              Cocok untuk liburan singkat
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Lokasi Bogor yang dekat dari Jakarta dan sekitarnya membuat kota
              ini menjadi pilihan favorit untuk one day trip maupun liburan
              akhir pekan.
            </p>
          </article>
        </div>
      </section>

      <RecommendationSection />
    </>
  );
}

export default Home;
