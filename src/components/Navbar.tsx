import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Heart, Sun, Cloud, CloudRain } from 'lucide-react';
import { AnimatedNavigationTabs, type NavItem } from '@/components/ui/animated-navigation-tabs';

const navItems: NavItem[] = [
  { id: 'home', to: '/', label: 'Beranda', icon: Home },
  { id: 'explore', to: '/destinations', label: 'Eksplorasi', icon: Compass },
  { id: 'recommend', to: '/recommendations', label: 'Rekomendasi', icon: Sparkles },
  { id: 'favorites', to: '/favorites', label: 'Favorit', icon: Heart },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [weather, setWeather] = useState<{ temp: string; state: 'sunny' | 'cloudy' | 'rain' } | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch real-time weather from Open-Meteo
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-6.601366133698881&longitude=106.80507887982482&current=temperature_2m,weather_code'
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.current) {
          const tempVal = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let wState: 'sunny' | 'cloudy' | 'rain' = 'sunny';
          if (code >= 51) {
            wState = 'rain';
          } else if (code >= 1 && code <= 48) {
            wState = 'cloudy';
          }
          setWeather({ temp: `${tempVal}°`, state: wState });
        }
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    }
    fetchWeather();
  }, []);

  const activeState = weather?.state || 'cloudy';
  const displayTemp = weather?.temp || '24°';
  const WeatherIcon = activeState === 'sunny' ? Sun : activeState === 'rain' ? CloudRain : Cloud;
  const iconColor = activeState === 'sunny' ? 'text-amber-400' : activeState === 'rain' ? 'text-emerald-400' : 'text-blue-300';

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow,padding] duration-500',
          scrolled
            ? 'bg-forest-900/80 backdrop-blur-xl border-b border-forest-700/20 shadow-lg shadow-black/10 py-3'
            : 'bg-transparent border-b border-transparent py-5',
        ].join(' ')}
      >
        <div className="shell flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110">
              <img src="/tugukujang.webp" alt="Tugu Kujang" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight text-forest-50 leading-none">
                Bogornesia
              </p>
              <p className="mt-0.5 text-[11px] text-forest-500 leading-none">
                Jelajahi Kota Hujan
              </p>
            </div>
          </NavLink>

          {/* Desktop nav with Animated Tabs */}
          <nav className="hidden md:block">
            <AnimatedNavigationTabs items={navItems} />
          </nav>

          {/* Weather Widget (Desktop & Mobile Responsive) */}
          <div className="flex items-center gap-2 bg-forest-950/40 border border-forest-800/30 rounded-full px-2.5 py-1 sm:px-4 sm:py-1.5 shadow-inner select-none">
            <WeatherIcon className={`h-3.5 w-3.5 ${iconColor} animate-pulse`} />
            <span className="font-mono text-xs sm:text-sm font-bold text-forest-100">{displayTemp}</span>
            <div className="h-3 w-px bg-forest-800 hidden sm:block" />

            {/* Desktop live label */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-forest-50">Bogor</span>
            </div>

            {/* Mobile simplified live pulsing dot */}
            <span className="relative flex h-1.5 w-1.5 sm:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-3 mb-3 rounded-2xl border border-forest-700/20
          bg-forest-900/85 backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => [
                    'flex flex-col items-center gap-1 px-4 py-1.5 transition-colors duration-200',
                    isActive ? 'text-forest-300' : 'text-forest-600 hover:text-forest-400'
                  ].join(' ')}
                >
                  {({ isActive }) => (
                    <>
                      <div className={[
                        'flex h-8 w-8 items-center justify-center rounded-xl transition-[background-color,transform] duration-300',
                        isActive ? 'bg-forest-700/40 scale-110' : ''
                      ].join(' ')}>
                        {Icon && <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.5 : 2} />}
                      </div>
                      <span className="text-[10px] font-semibold tracking-wide">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
