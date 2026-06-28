import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { usePageMeta } from '@/lib/use-page-meta';

export default function NotFound() {
  usePageMeta('Halaman Tidak Ditemukan', 'Halaman yang Anda cari tidak tersedia.');

  return (
    <section className="shell pt-28 py-20 flex min-h-[60vh] items-center justify-center">
      <ScrollReveal>
        <div className="glass-card mx-auto max-w-2xl p-10 text-center sm:p-14 border-rose-900/20 shadow-rose-900/5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500 animate-pulse">
            Error 404
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-forest-50 sm:text-5xl">
            Tersesat di Hutan?
          </h1>
          <p className="mt-5 text-base leading-8 text-forest-400/80">
            Halaman yang Anda cari mungkin telah dipindahkan atau tidak pernah ada.
            Mari kembali ke jalur yang benar.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary">
              Kembali ke Beranda
            </Link>
            <Link to="/destinations" className="btn-secondary">
              Lihat Destinasi
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
