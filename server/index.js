const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { LRUCache } = require('lru-cache');

const app = express();
const PORT = process.env.PORT || 3001;
const provider = (process.env.PLACES_PROVIDER || 'nominatim').toLowerCase();
const placesApiKey = process.env.PLACES_API_KEY;

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return null;
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

const normalizePlaces = (places, origin) => {
  return places
    .filter((place) => place.lat && place.lng && place.name)
    .map((place) => {
      const distance = origin ? haversineDistance(origin.lat, origin.lng, place.lat, place.lng) : null;

      return {
        id: place.id,
        name: place.name,
        address: place.address,
        rating: place.rating ?? null,
        hours: place.hours || 'Horario no disponible',
        distance: formatDistance(distance) || 'Distancia no disponible',
        open: place.open ?? null,
        location: {
          lat: place.lat,
          lng: place.lng,
        },
      };
    });
};

const fetchFromGooglePlaces = async ({ lat, lng, radius, query }) => {
  if (!placesApiKey) {
    throw new Error('PLACES_API_KEY is required for Google Places provider');
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radius);
  url.searchParams.set('keyword', query || 'store');
  url.searchParams.set('key', placesApiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Google Places responded with status ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places error: ${data.status}`);
  }

  return (data.results || []).map((place) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity,
    rating: place.rating ?? null,
    hours: place.opening_hours?.weekday_text?.join(' • ') || 'Horario no disponible',
    open: place.opening_hours?.open_now ?? null,
    lat: place.geometry?.location?.lat,
    lng: place.geometry?.location?.lng,
  }));
};

const fetchFromNominatim = async ({ lat, lng, query }) => {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', query || 'supermarket');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('extratags', '1');
  url.searchParams.set('limit', '50');
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lng);

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Maqoo-App/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim responded with status ${response.status}`);
  }

  const data = await response.json();
  return (data || []).map((place) => ({
    id: place.place_id?.toString(),
    name: place.name || place.display_name?.split(',')[0] || 'Lugar sin nombre',
    address: place.display_name,
    rating: null,
    hours: place.extratags?.opening_hours || 'Horario no disponible',
    open: null,
    lat: place.lat ? Number(place.lat) : null,
    lng: place.lon ? Number(place.lon) : null,
  }));
};

const getProviderData = async ({ lat, lng, radius, query }) => {
  if (provider === 'google') {
    return fetchFromGooglePlaces({ lat, lng, radius, query });
  }

  return fetchFromNominatim({ lat, lng, query });
};

app.get('/stores/nearby', async (req, res) => {
  const lat = toNumber(req.query.lat, null);
  const lng = toNumber(req.query.lng, null);
  const radius = toNumber(req.query.radius, 5000);
  const query = req.query.query || '';
  const page = Math.max(1, toNumber(req.query.page, 1));
  const pageSize = Math.max(1, Math.min(25, toNumber(req.query.pageSize, 10)));

  if (lat === null || lng === null) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const cacheKey = `stores:${provider}:${lat}:${lng}:${radius}:${query}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    const start = (page - 1) * pageSize;
    const paginated = cached.slice(start, start + pageSize);
    return res.json({
      provider,
      results: paginated,
      pagination: {
        page,
        pageSize,
        total: cached.length,
      },
      cached: true,
    });
  }

  try {
    const places = await getProviderData({ lat, lng, radius, query });
    const normalized = normalizePlaces(places, { lat, lng });
    cache.set(cacheKey, normalized);

    const start = (page - 1) * pageSize;
    const paginated = normalized.slice(start, start + pageSize);

    return res.json({
      provider,
      results: paginated,
      pagination: {
        page,
        pageSize,
        total: normalized.length,
      },
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    return res.status(500).json({ error: error.message || 'Unexpected error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (provider: ${provider})`);
});
