import { Link } from 'react-router-dom';
import heroImage from '../assets/images/hero-bogor.svg';

function Hero() {
  return (
    <section className="shell py-10 sm:py-14">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div>
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Explore Bogor
          </span>
          <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Temukan destinasi wisata Bogor yang cocok untuk liburanmu.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Jelajahi tempat wisata alam, keluarga, edukasi, dan taman hiburan di
            Bogor. Website ini memakai data lokal agar tetap aman, gratis, dan
            mudah dijalankan, dengan dukungan Geoapify untuk pencarian tambahan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/destinations"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Lihat Destinasi
            </Link>
            <Link
              to="/recommendations"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Cari Rekomendasi
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
          <img
            src={heroImage}
            alt="Ilustrasi wisata Bogor"
            className="relative mx-auto w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-white/5 p-4"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
