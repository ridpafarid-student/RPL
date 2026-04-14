import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const SLIDES = [
  {
    url: 'https://cdn.antaranews.com/cache/1200x800/2024/12/11/IMG_6114.jpeg',
    alt: 'Tugu Kujang Bogor',
  },
  {
    url: 'https://p0.piqsels.com/preview/455/605/131/indonesia-puncak-pass-bogor-bogor-landscape.jpg',
    alt: 'Puncak Bogor',
  },
  {
    url: 'https://akcdn.detik.net.id/visual/2020/12/16/air-terjun-banyumala_169.jpeg?w=1200',
    alt: 'Alam Bogor',
  },
  {
    url: 'https://c4.wallpaperflare.com/wallpaper/422/323/810/bogor-palace-wallpaper-preview.jpg',
    alt: 'Istana Bogor',
  },
];

const INTERVAL = 5000;

function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(false);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setCurrent(index);
    setProgress(false);
    setTimeout(() => setProgress(true), 50);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setProgress(false);
      setTimeout(() => setProgress(true), 50);
    }, INTERVAL);
  };

  useEffect(() => {
    setProgress(true);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setProgress(false);
      setTimeout(() => setProgress(true), 50);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="shell py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/30 min-h-[420px] flex items-center">

        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${slide.url})`,
              opacity: i === current ? 1 : 0,
            }}
            aria-label={slide.alt}
          />
        ))}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />

        {/* Content */}
        <div className="relative z-10 px-8 py-14 sm:px-12 lg:px-16 max-w-2xl">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Explore Bogor
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Temukan destinasi wisata Bogor yang cocok untuk liburanmu.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Jelajahi tempat wisata alam, keluarga, edukasi, dan taman hiburan di
            Bogor. Gratis, aman, dan mudah diakses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/destinations"
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95"
            >
              Lihat Destinasi
            </Link>
            <Link
              to="/recommendations"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              Cari Rekomendasi
            </Link>
          </div>
        </div>

        {/* Slide counter */}
        <div className="absolute top-5 right-6 z-10 text-xs text-white/50">
          {current + 1} / {SLIDES.length}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-emerald-400'
                  : 'w-2 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[3px] bg-emerald-400 z-10"
          style={{
            width: progress ? '100%' : '0%',
            transition: progress ? `width ${INTERVAL}ms linear` : 'none',
          }}
        />
      </div>
    </section>
  );
}

export default Hero;