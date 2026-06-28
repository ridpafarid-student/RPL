import { useEffect, useRef, useState } from 'react';
import Map, { Marker, Popup, MapRef, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Destination } from '@/types';

interface DestinationsMapProps {
  destinations: Destination[];
  activeId: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function DestinationsMap({ destinations, activeId, onMarkerClick }: DestinationsMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
  const mapStyle = `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;

  // Calculate and fit bounds when destinations change
  useEffect(() => {
    if (destinations.length > 0) {
      const lngs = destinations.map(d => d.location?.lng).filter(Boolean) as number[];
      const lats = destinations.map(d => d.location?.lat).filter(Boolean) as number[];
      if (lngs.length > 0 && lats.length > 0) {
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        
        mapRef.current?.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 80, duration: 2500, pitch: 45, bearing: 0, maxZoom: 14 }
        );
      }
    }
  }, [destinations]);

  return (
    <div className="h-full w-full bg-forest-900 overflow-hidden relative rounded-3xl shadow-2xl border border-forest-700/30">
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-forest-950/85 z-20 flex flex-col items-center justify-center gap-3 backdrop-blur-sm transition-opacity duration-500 pointer-events-none">
          <div className="h-10 w-10 rounded-full border-2 border-forest-800 border-t-gold-400 animate-spin" />
          <p className="text-xs font-semibold tracking-wider text-forest-400 uppercase animate-pulse">
            Memuat Peta...
          </p>
        </div>
      )}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 106.7973,
          latitude: -6.5976,
          zoom: 12,
          pitch: 45,
          bearing: 0
        }}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        terrain={{ source: 'maptiler-terrain', exaggeration: 1.2 }}
        onLoad={() => setMapLoaded(true)}
      >
        <Source id="maptiler-terrain" type="raster-dem" url={`https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`} />
        
        {destinations.map((dest) => {
          if (!dest.location?.lat || !dest.location?.lng) return null;
          const isActive = dest.id === activeId || popupInfo?.id === dest.id;
          
          return (
            <Marker 
              key={dest.id} 
              longitude={dest.location.lng}
              latitude={dest.location.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(dest);
                onMarkerClick?.(dest.id);
                // Fly to the marker when clicked
                mapRef.current?.flyTo({
                  center: [dest.location.lng, dest.location.lat],
                  zoom: 16,
                  pitch: 55,
                  bearing: 20,
                  duration: 2000,
                  essential: true
                });
              }}
              style={{ zIndex: isActive ? 50 : 10 }}
            >
              <div className={`relative flex items-center justify-center rounded-full border-2 
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer backdrop-blur shadow-lg shadow-black/40
                ${isActive ? 'w-10 h-10 border-gold-400 bg-forest-900 scale-110' : 'w-8 h-8 border-forest-400 bg-forest-900/80 hover:scale-110 hover:border-gold-400'}`}>
                <MapPin className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-forest-300'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                  </span>
                )}
              </div>
            </Marker>
          );
        })}

        {popupInfo && popupInfo.location?.lat && popupInfo.location?.lng && (
          <Popup
            longitude={popupInfo.location.lng}
            latitude={popupInfo.location.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="modern-popup"
            offset={[0, -45]}
            maxWidth="320px"
          >
            <div className="group relative w-[280px] h-[320px] rounded-2xl overflow-hidden shadow-2xl border border-forest-700/50 block">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
                style={{ backgroundImage: `url(${popupInfo.photos?.[0] || popupInfo.image || ''})` }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, rgba(10,31,20, 0.95), rgba(10,31,20, 0.4) 50%, transparent 80%)` }}
              />
              <div className="relative flex flex-col justify-end h-full p-5 text-white">
                <h4 className="text-xl font-bold tracking-tight text-forest-50">{popupInfo.name}</h4>
                <p className="text-xs text-forest-200 mt-1 font-medium">
                  ⭐ {popupInfo.rating.toFixed(1)} • Rp{popupInfo.price.toLocaleString('id-ID')}
                </p>
                <Link
                  to={`/destinations/${popupInfo.id}`}
                  className="mt-4 flex items-center justify-between bg-forest-800/40 backdrop-blur-md border border-forest-600/30 
                             rounded-xl px-4 py-2.5 transition-[background-color,transform] duration-300 ease-out hover:bg-forest-700/50 active:scale-95"
                >
                  <span className="text-xs font-semibold text-forest-50">Jelajahi</span>
                  <ArrowRight className="h-3 w-3 text-forest-50 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Reset View Button */}
      <button
        type="button"
        onClick={() => {
          setPopupInfo(null);
          const lngs = destinations.map(d => d.location?.lng).filter(Boolean) as number[];
          const lats = destinations.map(d => d.location?.lat).filter(Boolean) as number[];
          if (lngs.length > 0 && lats.length > 0) {
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            mapRef.current?.fitBounds(
              [[minLng, minLat], [maxLng, maxLat]],
              { padding: 80, duration: 2500, pitch: 45, bearing: 0, maxZoom: 14 }
            );
          }
        }}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-forest-900/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-forest-100 border border-forest-600/30 shadow-xl transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-forest-800 hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Reset Peta
      </button>

      {/* Modern Popup Overrides */}
      <style>{`
        .modern-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .modern-popup .maplibregl-popup-tip {
          display: none !important;
        }
        .modern-popup .maplibregl-popup-close-button {
          color: white;
          z-index: 100;
          font-size: 20px;
          right: 8px;
          top: 8px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .modern-popup .maplibregl-popup-close-button:hover {
          background: rgba(0,0,0,0.6);
        }
      `}</style>
    </div>
  );
}
