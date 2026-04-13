import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/destinations', label: 'Destinasi' },
  { to: '/recommendations', label: 'Rekomendasi' },
  { to: '/favorites', label: 'Favorit' },
];

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              BogorTrip
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
              Panduan destinasi wisata Bogor yang lebih rapi dan mudah dijelajahi.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Temukan tempat wisata alam, keluarga, edukasi, dan pilihan destinasi
              populer di Bogor dalam satu pengalaman yang sederhana dan jelas.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Navigasi
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm font-medium text-slate-700 transition hover:text-emerald-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Jelajahi
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Mulai dari daftar destinasi lengkap atau gunakan halaman rekomendasi
              untuk menemukan tempat yang paling sesuai dengan kebutuhanmu.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/destinations"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Lihat destinasi
              </Link>
              <Link
                to="/recommendations"
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
              >
                Cari rekomendasi
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 BogorTrip. Semua informasi destinasi disajikan untuk membantu perencanaan wisata.</p>
          <p>Eksplor destinasi Bogor dengan lebih nyaman.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
