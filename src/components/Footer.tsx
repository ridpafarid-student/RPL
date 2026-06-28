import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/destinations', label: 'Eksplorasi' },
  { to: '/recommendations', label: 'Rekomendasi' },
  { to: '/favorites', label: 'Favorit' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-forest-800/50 bg-forest-950 pb-24 md:pb-0">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-600/30 to-transparent" />

      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_1fr]">
          {/* Brand Column */}
          <div className="max-w-md">
            <p className="font-display text-2xl font-bold text-forest-50">
              Bogornesia
            </p>
            <p className="mt-1 text-sm font-medium text-gold-500 tracking-wide">
              Jelajahi Pesona Kota Hujan
            </p>
            <p className="mt-5 text-sm leading-7 text-forest-400/80">
              Platform panduan wisata Bogor yang dirancang untuk membantu
              kamu menemukan destinasi terbaik — dari kebun raya legendaris
              hingga petualangan keluarga yang tak terlupakan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">
              Navigasi
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm font-medium text-forest-400 transition-[color,transform] duration-300 ease-out
                    hover:text-gold-400 hover:translate-x-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="glass-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500">
              Mulai Menjelajah
            </p>
            <p className="mt-4 text-sm leading-7 text-forest-400/80">
              Lihat daftar destinasi lengkap atau gunakan fitur rekomendasi
              cerdas untuk menemukan tempat yang paling cocok untukmu.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/destinations" className="btn-primary text-xs px-5 py-2.5">
                Lihat Destinasi
              </Link>
              <Link to="/recommendations" className="btn-secondary text-xs px-5 py-2.5">
                Cari Rekomendasi
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-forest-800/40 pt-8
          text-xs text-forest-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Bogornesia. Dibuat untuk tugas RPL.</p>
          <p className="text-forest-700">
            Eksplorasi destinasi Bogor dengan lebih nyaman.
          </p>
        </div>
      </div>
    </footer>
  );
}
