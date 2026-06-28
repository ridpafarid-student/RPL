import { Sun, Cloud, CloudRain, Sparkles } from 'lucide-react';

export type WeatherState = 'sunny' | 'cloudy' | 'rain';

interface WeatherWidgetProps {
  activeWeather: WeatherState;
  onWeatherChange: (weather: WeatherState) => void;
  applyWeatherFilter: boolean;
  onFilterToggle: (apply: boolean) => void;
  isRealtime: boolean;
  realtimeTemp: string | null;
}

export default function WeatherWidget({
  activeWeather,
  onWeatherChange,
  applyWeatherFilter,
  onFilterToggle,
  isRealtime,
  realtimeTemp,
}: WeatherWidgetProps) {
  // Get weather metadata for formatting
  const getWeatherMeta = () => {
    switch (activeWeather) {
      case 'sunny':
        return {
          title: 'Cerah',
          temp: '29°',
          desc: 'Sangat cocok untuk eksplorasi alam, puncak, dan petualangan outdoor.',
          icon: Sun,
        };
      case 'cloudy':
        return {
          title: 'Berawan',
          temp: '26°',
          desc: 'Cuaca sejuk dan teduh, ideal untuk segala jenis destinasi wisata.',
          icon: Cloud,
        };
      case 'rain':
      default:
        return {
          title: 'Hujan Gerimis',
          temp: '22°',
          desc: 'Disarankan memilih destinasi indoor / museum agar tetap nyaman.',
          icon: CloudRain,
        };
    }
  };

  const meta = getWeatherMeta();
  const IconComponent = meta.icon;
  const displayTemp = realtimeTemp || meta.temp;

  return (
    <div className="mt-6 w-full rounded-2xl border border-forest-800/30 bg-forest-900/10 p-5 backdrop-blur-md">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Left: Weather Info (Editorial Style) */}
        <div className="flex items-center gap-5">
          {/* Giant Temp Display */}
          <div className="flex items-baseline gap-1 select-none">
            <span className="font-display text-4xl sm:text-5xl font-black text-forest-100 tracking-tighter">
              {displayTemp}
            </span>
            <IconComponent className="h-5 w-5 text-forest-400 animate-pulse" />
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-forest-800/40" />

          {/* Description */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-forest-100">
                Bogor saat ini &bull; <span className="text-forest-300 font-semibold">{meta.title}</span>
              </h3>
              {isRealtime ? (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold tracking-widest text-emerald-400 uppercase select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center rounded bg-forest-800/60 border border-forest-700/30 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-forest-400 uppercase select-none">
                  Simulasi
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-forest-400 leading-normal max-w-sm sm:max-w-md">
              {meta.desc}
            </p>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-4 border-t border-forest-800/20 pt-4 md:border-t-0 md:pt-0">
          
          {/* Weather Selector (Icon Buttons) */}
          <div className="flex items-center rounded-xl bg-forest-950/60 border border-forest-800/30 p-1">
            {([
              { key: 'sunny', icon: Sun, label: 'Cerah' },
              { key: 'cloudy', icon: Cloud, label: 'Berawan' },
              { key: 'rain', icon: CloudRain, label: 'Hujan' },
            ] as const).map((w) => {
              const WIcon = w.icon;
              const isActive = activeWeather === w.key;
              return (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => onWeatherChange(w.key)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-forest-800 text-forest-100 shadow border border-forest-700/50 scale-105'
                      : 'text-forest-500 hover:text-forest-300'
                  }`}
                  title={w.label}
                  aria-label={w.label}
                >
                  <WIcon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Smart Filter Pill */}
          <button
            type="button"
            onClick={() => onFilterToggle(!applyWeatherFilter)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
              applyWeatherFilter
                ? 'bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-[0_0_20px_rgba(212,168,67,0.15)] scale-105'
                : 'bg-forest-950/60 border border-forest-800/30 text-forest-400 hover:text-forest-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{applyWeatherFilter ? 'Rekomendasi Cerdas: Aktif' : 'Rekomendasi Cerdas'}</span>
          </button>

        </div>
      </div>
    </div>
  );
}
