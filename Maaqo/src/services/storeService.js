// Servicio para manejar tiendas cercanas
// Por ahora usa datos mock, en el futuro se integrará con Google Maps API

const MOCK_STORES = [
  {
    id: '1',
    name: 'Supermercado La Esperanza',
    address: 'Av. Principal 123, Lima',
    distance: '0.5 km',
    rating: 4.5,
    open: true,
    hours: '8:00 AM - 10:00 PM',
    phone: '+51 999 888 777',
  },
  {
    id: '2',
    name: 'Mercado Central',
    address: 'Jr. Comercio 456, Lima',
    distance: '1.2 km',
    rating: 4.2,
    open: true,
    hours: '6:00 AM - 8:00 PM',
    phone: '+51 999 888 666',
  },
  {
    id: '3',
    name: 'Tienda Don Pepe',
    address: 'Calle Los Olivos 789, Lima',
    distance: '2.1 km',
    rating: 4.0,
    open: false,
    hours: '7:00 AM - 9:00 PM',
    phone: '+51 999 888 555',
  },
  {
    id: '4',
    name: 'Supermercado El Ahorro',
    address: 'Av. Universitaria 321, Lima',
    distance: '3.5 km',
    rating: 4.7,
    open: true,
    hours: '24 horas',
    phone: '+51 999 888 444',
  },
  {
    id: '5',
    name: 'Bodega San Miguel',
    address: 'Jr. San Martín 654, Lima',
    distance: '1.8 km',
    rating: 3.8,
    open: true,
    hours: '7:00 AM - 11:00 PM',
    phone: '+51 999 888 333',
  },
];

/**
 * Obtiene tiendas cercanas (mock data por ahora)
 * En el futuro, esto hará una llamada a Google Maps Places API
 */
export const getNearbyStores = async (limit = 5) => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Por ahora retorna datos mock
  // TODO: Integrar con Google Maps Places API
  // const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=supermarket&key=${API_KEY}`);
  // const data = await response.json();
  
  return MOCK_STORES.slice(0, limit);
};

/**
 * Busca tiendas por nombre (mock)
 */
export const searchStores = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query || query.trim() === '') {
    return MOCK_STORES;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  return MOCK_STORES.filter(store =>
    store.name.toLowerCase().includes(normalizedQuery) ||
    store.address.toLowerCase().includes(normalizedQuery)
  );
};

