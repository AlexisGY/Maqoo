import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';

import StoreCard from '../components/StoreCard';
import SearchBar from '../components/SearchBar';
import { getNearbyStores, searchStores } from '../services/storeService';

const DEFAULT_PARAMS = {
  radius: 4000,
  pageSize: 6,
};

const StoreListScreen = () => {
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [permissionChecked, setPermissionChecked] = useState(false);

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setError('Activa los permisos de ubicación para ver tiendas cercanas.');
        setPermissionChecked(true);
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(coords);
      setPermissionChecked(true);
      return coords;
    } catch (e) {
      setError('No se pudo obtener tu ubicación.');
      setPermissionChecked(true);
      return null;
    }
  }, []);

  const loadStores = useCallback(
    async (page = 1) => {
      setLoading(true);
      let coords = location;
      if (!coords && !permissionChecked) {
        coords = await requestLocation();
      }

      if (!coords) {
        setError((prev) => prev || 'Ubicación no disponible.');
        setStores([]);
        setPagination({ page: 1, pageSize: DEFAULT_PARAMS.pageSize, total: 0 });
        setLoading(false);
        return;
      }

      setError(null);

      const response = query
        ? await searchStores(query, { ...DEFAULT_PARAMS, ...coords, page })
        : await getNearbyStores({ ...DEFAULT_PARAMS, ...coords, page });

      if (response.error) {
        setError(response.error);
        setStores([]);
      } else {
        setStores(response.stores);
        setPagination(response.pagination);
      }
      setLoading(false);
    },
    [query, location, permissionChecked, requestLocation],
  );

  useEffect(() => {
    loadStores(1);
  }, [loadStores]);

  const nextPage = () => {
    if (pagination.page * pagination.pageSize < pagination.total) {
      loadStores(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      loadStores(pagination.page - 1);
    }
  };

  const hasMore = pagination.page * pagination.pageSize < pagination.total;

  return (
    <View className="flex-1 bg-food-light p-4">
      <SearchBar onSearch={setQuery} placeholder="Buscar tiendas..." />

      {loading && (
        <View className="items-center py-6">
          <ActivityIndicator size="large" color="#FF8C42" />
          <Text className="text-gray-600 mt-2">Cargando tiendas...</Text>
        </View>
      )}

      {error && (
        <View className="bg-red-100 border border-red-200 rounded-xl p-4 mb-4">
          <Text className="text-red-800 font-semibold">No se pudieron cargar las tiendas</Text>
          <Text className="text-red-700 mt-1">{error}</Text>
        </View>
      )}

      {!loading && !error && stores.length === 0 && permissionChecked && (
        <View className="items-center py-8">
          <Icon name="store-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-600 mt-3 text-center">
            No se encontraron tiendas con ese criterio
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </ScrollView>

      <View className="flex-row justify-between items-center mt-4">
        <TouchableOpacity
          onPress={previousPage}
          disabled={pagination.page <= 1 || loading}
          className={`flex-1 mr-2 rounded-xl p-3 items-center ${
            pagination.page <= 1 || loading ? 'bg-gray-200' : 'bg-white'
          }`}
        >
          <Text className="text-food-dark font-semibold">Anterior</Text>
        </TouchableOpacity>

        <Text className="mx-2 text-food-dark font-semibold">
          Página {pagination.page}
        </Text>

        <TouchableOpacity
          onPress={nextPage}
          disabled={!hasMore || loading}
          className={`flex-1 ml-2 rounded-xl p-3 items-center ${
            !hasMore || loading ? 'bg-gray-200' : 'bg-white'
          }`}
        >
          <Text className="text-food-dark font-semibold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StoreListScreen;
