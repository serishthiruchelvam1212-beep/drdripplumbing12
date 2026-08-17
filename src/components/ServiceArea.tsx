import { useState } from 'react';
import { MapPin, Phone, Search, Crosshair, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { BUSINESS_ADDRESS, BUSINESS_COORDINATES, BUSINESS_PHONE_TEL, SERVICE_RADIUS_KM } from '@/lib/business';
import { geocodeAddress, haversineDistanceKm, reverseGeocode } from '@/lib/geocode';

// Fix default marker icon paths for bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type CheckState = 'idle' | 'checking' | 'result';

interface CheckResult {
  within: boolean;
  distanceKm: number;
  locationName: string;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function ServiceArea() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<CheckState>('idle');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [reverseChecking, setReverseChecking] = useState(false);

  const processLocation = async (lat: number, lng: number, name?: string) => {
    setReverseChecking(true);
    try {
      const locationName = name || (await reverseGeocode(lat, lng)) || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const distance = haversineDistanceKm(BUSINESS_COORDINATES, { lat, lng });
      setResult({
        within: distance <= SERVICE_RADIUS_KM,
        distanceKm: Math.round(distance),
        locationName,
      });
      setState('result');
    } catch {
      setError('Location lookup failed. Please try again or call us to confirm.');
      setState('idle');
    } finally {
      setReverseChecking(false);
    }
  };

  const handleMapPick = async (lat: number, lng: number) => {
    setPickedCoords({ lat, lng });
    setError(null);
    await processLocation(lat, lng);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter your address or postal code.');
      return;
    }
    setError(null);
    setState('checking');
    setResult(null);
    try {
      const geo = await geocodeAddress(query);
      if (!geo) {
        setError('We could not find that location. Please try a different address or postal code.');
        setState('idle');
        return;
      }
      setPickedCoords({ lat: geo.lat, lng: geo.lng });
      const distance = haversineDistanceKm(BUSINESS_COORDINATES, { lat: geo.lat, lng: geo.lng });
      setResult({
        within: distance <= SERVICE_RADIUS_KM,
        distanceKm: Math.round(distance),
        locationName: geo.displayName,
      });
      setState('result');
    } catch {
      setError('Location lookup failed. Please try again or call us to confirm.');
      setState('idle');
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setReverseChecking(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPickedCoords({ lat: latitude, lng: longitude });
        await processLocation(latitude, longitude);
      },
      () => {
        setError('Could not get your location. Please enter your address manually or click the map.');
        setReverseChecking(false);
      },
    );
  };

  return (
    <section id="service-area" className="bg-navy-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Service Area</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            We serve locations within approximately {SERVICE_RADIUS_KM} km of our location. Enter your
            address, click on the map, or use your current location to see if you fall within our
            service area.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
            <div className="relative h-80 w-full sm:h-96">
              <MapContainer
                center={[BUSINESS_COORDINATES.lat, BUSINESS_COORDINATES.lng]}
                zoom={8}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Circle
                  center={[BUSINESS_COORDINATES.lat, BUSINESS_COORDINATES.lng]}
                  radius={SERVICE_RADIUS_KM * 1000}
                  pathOptions={{ color: '#2f8fff', fillColor: '#2f8fff', fillOpacity: 0.08, weight: 2 }}
                />
                <Marker position={[BUSINESS_COORDINATES.lat, BUSINESS_COORDINATES.lng]}>
                  <Popup>
                    <strong>Freelance Plumbing</strong>
                    <br />
                    {BUSINESS_ADDRESS}
                  </Popup>
                </Marker>
                {pickedCoords && (
                  <Marker position={[pickedCoords.lat, pickedCoords.lng]}>
                    <Popup>Your selected location</Popup>
                  </Marker>
                )}
                <ClickHandler onPick={handleMapPick} />
              </MapContainer>
              {reverseChecking && (
                <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-navy-700 shadow-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Locating…
                </div>
              )}
            </div>
            <p className="px-5 py-3 text-xs text-navy-400">
              Click anywhere on the map to check that location. Blue circle shows an approximate{' '}
              {SERVICE_RADIUS_KM} km radius.
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-navy-900">
                <MapPin className="h-5 w-5 text-brand-500" aria-hidden="true" />
                Check Your Location
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                Enter your postal code or address, or click on the map to set your location.
              </p>
            </div>

            <form onSubmit={handleCheck} noValidate>
              <label htmlFor="area-query" className="sr-only">
                Address or postal code
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="area-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. M1G 3S5 or 123 Main St, Toronto"
                  className="flex-1 rounded-lg border border-navy-200 px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                <button
                  type="submit"
                  disabled={state === 'checking'}
                  className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  {state === 'checking' ? 'Checking…' : 'Check'}
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={useMyLocation}
              disabled={reverseChecking}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-navy-200 px-5 py-3 text-base font-semibold text-navy-700 transition-colors hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Crosshair className="h-5 w-5" aria-hidden="true" />
              Use my current location
            </button>

            {error && (
              <p role="alert" className="text-sm font-medium text-error-600">
                {error}
              </p>
            )}

            {state === 'result' && result && (
              <div
                className={`rounded-xl border p-5 ${
                  result.within
                    ? 'border-success-200 bg-success-50 text-success-800'
                    : 'border-warning-200 bg-warning-50 text-warning-800'
                }`}
              >
                <p className="font-semibold">
                  {result.within
                    ? 'Your location appears to be within our service area.'
                    : 'Your location may be outside our regular service area. Please call us to confirm.'}
                </p>
                <p className="mt-1 text-sm opacity-90">
                  Location: {result.locationName}
                </p>
                <p className="mt-1 text-sm opacity-90">
                  Approximate distance: {result.distanceKm} km from our location.
                </p>
                {!result.within && (
                  <a
                    href={BUSINESS_PHONE_TEL}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-white hover:bg-accent-600"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call to Confirm
                  </a>
                )}
              </div>
            )}

            <div className="mt-auto rounded-lg bg-navy-50 p-4 text-sm text-navy-500">
              <p className="font-medium text-navy-700">Our location</p>
              <p className="mt-1">{BUSINESS_ADDRESS}</p>
              <p className="mt-2">Service radius: approximately {SERVICE_RADIUS_KM} km</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
