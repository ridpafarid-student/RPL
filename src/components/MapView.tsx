import Map, { Marker, Popup, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';
import type { Destination } from '@/types';

interface MapViewProps {
  destination: Destination;
}

export default function MapView({ destination }: MapViewProps) {
  const lat = destination?.location?.lat;
  const lng = destination?.location?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return (
      <div className="glass-card flex min-h-[320px] items-center justify-center p-6 text-center text-sm text-forest-500">
        Koordinat destinasi belum tersedia.
      </div>
    );
  }

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
  const mapStyle = `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;

  return (
    <div className="overflow-hidden rounded-3xl shadow-2xl border border-forest-700/30">
      <div className="h-[360px] w-full bg-forest-900 relative">
        <Map
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 15,
            pitch: 45,
            bearing: 0
          }}
          mapStyle={mapStyle}
          style={{ width: '100%', height: '100%' }}
          terrain={{ source: 'maptiler-terrain', exaggeration: 1.2 }}
        >
          <Source id="maptiler-terrain" type="raster-dem" url={`https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`} />
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <div className="relative flex items-center justify-center rounded-full border-2 border-gold-400 bg-forest-900 w-10 h-10 shadow-lg shadow-black/40">
              <MapPin className="w-5 h-5 text-gold-400" />
              <span className="absolute -bottom-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
              </span>
            </div>
          </Marker>

          <Popup
            longitude={lng}
            latitude={lat}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            className="modern-popup"
            offset={[0, 10]}
          >
            <div className="rounded-xl bg-forest-900/90 backdrop-blur-md p-3 border border-forest-700/50 shadow-xl min-w-[150px]">
              <h4 className="text-forest-50 font-bold text-sm mb-1">{destination.name}</h4>
              <p className="text-forest-400 text-xs line-clamp-2 leading-relaxed">{destination.address}</p>
            </div>
          </Popup>
        </Map>
      </div>

      <style>{`
        .modern-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 12px;
          box-shadow: none !important;
        }
        .modern-popup .maplibregl-popup-tip {
          border-bottom-color: rgba(10, 31, 20, 0.9) !important;
        }
      `}</style>
    </div>
  );
}
