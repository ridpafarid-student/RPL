import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/favorites', label: 'Favorites' },
];

function linkClassName({ isActive }) {
  return [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-emerald-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700',
  ].join(' ');
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="shell flex items-center justify-between py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-extrabold text-white">
            B
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              BogorTrip
            </p>
            <p className="text-xs text-slate-500">
              Wisata Kota Bogor tanpa ribet
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex rounded-2xl border border-stone-200 p-2 text-slate-700 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="shell pb-4 md:hidden">
          <nav className="surface-card flex flex-col gap-2 p-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClassName}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
