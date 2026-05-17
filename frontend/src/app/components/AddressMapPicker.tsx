import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string, city: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const ChangeView = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export const AddressMapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLat, initialLng }) => {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? L.latLng(initialLat, initialLng) : null
  );
  const [center, setCenter] = useState<L.LatLngExpression>([41.311081, 69.240562]); // Tashkent default
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (position) {
      reverseGeocode(position.lat, position.lng);
    }
  }, [position]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
      const district = data.address.suburb || data.address.district || data.address.borough || '';
      const cityWithDistrict = district ? `${city}, ${district}` : city;
      onLocationSelect(lat, lng, data.display_name, cityWithDistrict);
    } catch (error) {
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`, '');
    }
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = L.latLng(latitude, longitude);
          setPosition(newPos);
          setCenter([latitude, longitude]);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
          alert('Joylashuvni aniqlash imkoni bo\'lmadi');
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Xaritadan belgilang
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:text-secondary transition-colors bg-primary/5 px-4 py-2 rounded-xl"
        >
          <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-pulse' : ''}`} />
          Mening joylashuvim
        </button>
      </div>
      
      <div className="relative h-[300px] rounded-2xl overflow-hidden border-2 border-border shadow-inner z-10">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <ChangeView center={center} />
        </MapContainer>
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold text-muted-foreground shadow-lg border border-border/50">
          Xaritaga bosing
        </div>
      </div>
      
      {position && (
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] font-black uppercase text-primary/60 mb-1">Tanlangan koordinatalar</p>
          <p className="text-sm font-bold truncate">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};
