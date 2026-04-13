import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="shell py-16 sm:py-24">
      <div className="surface-card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
          Route yang kamu buka tidak tersedia. Coba kembali ke home atau lanjut
          ke halaman destinasi.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Kembali ke Home
          </Link>
          <Link
            to="/destinations"
            className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
          >
            Lihat Destinasi
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
