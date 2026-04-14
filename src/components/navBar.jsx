import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/favorites', label: 'Favorites' },
];

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
      <path d="M17.5 10c0 4.5-5.5 9-5.5 9S6.5 14.5 6.5 10a5.5 5.5 0 0 1 11 0z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);
  const location = useLocation();

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sliding active indicator
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector('[data-active="true"]');
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={[
        'sticky top-0 z-40 bg-white/95 backdrop-blur-sm transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/80 shadow-sm shadow-slate-900/5'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="shell flex h-16 items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-emerald-600 text-white
            transition-all duration-200 group-hover:scale-105 group-hover:bg-emerald-700 group-hover:shadow-md group-hover:shadow-emerald-500/25">
            <MapPinIcon />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-slate-900 leading-none
              transition-colors duration-200 group-hover:text-emerald-700">
              BogorTrip
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 leading-none">
              Wisata Kota Bogor
            </p>
          </div>
        </NavLink>

        {/* Desktop nav with sliding indicator */}
        <nav ref={navRef} className="relative hidden items-center gap-0.5 md:flex">
          {/* Sliding background pill */}
          <span
            className="absolute top-0 h-full rounded-lg bg-emerald-50 transition-all duration-300 ease-out pointer-events-none"
            style={indicatorStyle}
          />
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              data-active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to)) ? 'true' : 'false'}
              className={({ isActive }) => [
                'relative z-10 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
                isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900',
              ].join(' ')}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle
                      animate-[pulse_2s_ease-in-out_infinite]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/destinations"
            className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
              transition-all duration-200 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/30
              hover:-translate-y-px active:translate-y-0 active:scale-95 md:inline-flex"
          >
            Mulai Jelajah
          </NavLink>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-500
              transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 md:hidden"
          >
            {/* Animated hamburger → X */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path
                d="M4 7h16"
                className="transition-all duration-300 origin-center"
                style={{ transform: isOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }}
              />
              <path
                d="M4 12h10"
                className="transition-all duration-200"
                style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'translateX(8px)' : 'none' }}
              />
              <path
                d="M4 17h16"
                className="transition-all duration-300 origin-center"
                style={{ transform: isOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — slide down */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out md:hidden"
        style={{
          maxHeight: isOpen ? '400px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="border-t border-slate-100 bg-white pb-4">
          <nav className="shell flex flex-col gap-0.5 pt-2">
            {navItems.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => [
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
                style={{
                  transitionDelay: isOpen ? `${i * 40}ms` : '0ms',
                  transform: isOpen ? 'translateX(0)' : 'translateX(-8px)',
                  opacity: isOpen ? 1 : 0,
                  transition: `transform 0.25s ease ${i * 40}ms, opacity 0.25s ease ${i * 40}ms, background-color 0.15s, color 0.15s`,
                }}
              >
                {item.label}
                <span className="text-slate-300">›</span>
              </NavLink>
            ))}

            <div
              className="mt-2 border-t border-slate-100 pt-2"
              style={{
                transitionDelay: isOpen ? `${navItems.length * 40}ms` : '0ms',
                transform: isOpen ? 'translateX(0)' : 'translateX(-8px)',
                opacity: isOpen ? 1 : 0,
                transition: `transform 0.25s ease ${navItems.length * 40}ms, opacity 0.25s ease ${navItems.length * 40}ms`,
              }}
            >
              <NavLink
                to="/destinations"
                className="block rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold
                  text-white transition-all duration-150 hover:bg-emerald-700 active:scale-95"
              >
                Mulai Jelajah
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;