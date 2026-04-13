import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapView({ destination }) {
  const latitude = destination?.location?.lat;
  const longitude = destination?.location?.lng;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <div className="surface-card flex min-h-[320px] items-center justify-center p-6 text-center text-sm text-slate-500">
        Koordinat destinasi belum tersedia.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 shadow-sm">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-[360px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{destination.name}</strong>
            <br />
            {destination.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
