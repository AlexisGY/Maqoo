import { buildUrl, fetchJson } from '../utils/apiClient';

const normalizeStore = (store) => ({
  id: store.id,
  name: store.name,
  address: store.address || 'Dirección no disponible',
  distance: store.distance || 'Distancia no disponible',
  rating: store.rating ?? 'N/D',
  hours: store.hours || 'Horario no disponible',
  open: store.open ?? null,
});

const defaultPagination = {
  page: 1,
  pageSize: 10,
  total: 0,
};

const fetchStores = async (params = {}) => {
  if (typeof params.lat !== 'number' || typeof params.lng !== 'number') {
    return {
      stores: [],
      pagination: { ...defaultPagination },
      error: 'Ubicación no disponible',
      loading: false,
    };
  }

  const mergedParams = {
    radius: 4000,
    page: 1,
    pageSize: 10,
    ...params,
  };

  const url = buildUrl('/stores/nearby', mergedParams);
  const state = {
    stores: [],
    pagination: { ...defaultPagination, page: mergedParams.page, pageSize: mergedParams.pageSize },
    error: null,
    loading: true,
  };

  try {
    const data = await fetchJson(url);
    return {
      ...state,
      loading: false,
      stores: (data.results || []).map(normalizeStore),
      pagination: data.pagination || state.pagination,
    };
  } catch (error) {
    return {
      ...state,
      loading: false,
      error: error.message || 'No se pudo obtener tiendas cercanas',
    };
  }
};

export const getNearbyStores = async (params = {}) => fetchStores(params);

export const searchStores = async (query, params = {}) => fetchStores({ ...params, query });
