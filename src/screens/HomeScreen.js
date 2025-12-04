import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RecipeCard from '../components/RecipeCard';
import StoreCard from '../components/StoreCard';
import { getFeaturedRecipes, getCookableRecipesList } from '../services/recipeService';
import { getPantry } from '../services/storageService';
import { getNearbyStores } from '../services/storeService';
import * as Location from 'expo-location';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [storeError, setStoreError] = useState(null);
  const [cookableCount, setCookableCount] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setStoreError('Activa los permisos de ubicación para ver tiendas cercanas.');
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
      setStoreError('No se pudo obtener tu ubicación.');
      setPermissionChecked(true);
      return null;
    }
  };

  const loadData = async () => {
    try {
      let coords = location;
      if (!coords && !permissionChecked) {
        coords = await requestLocation();
      }

      const [recipes, storesResponse, cookable, pantry] = await Promise.all([
        getFeaturedRecipes(6),
        coords ? getNearbyStores({ ...coords, pageSize: 5 }) : Promise.resolve({ stores: [], error: 'Ubicación no disponible.' }),
        getCookableRecipesList(),
        getPantry(),
      ]);

      setFeaturedRecipes(recipes);
      setNearbyStores(storesResponse.stores || []);
      setStoreError(storesResponse.error || null);
      setCookableCount(cookable.length);
      setPantryCount(pantry.length);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-food-light"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header con estadísticas */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-food-dark mb-2">
            ¡Hola! 👋
          </Text>
          <Text className="text-gray-600 mb-3">
            Encuentra qué cocinar con lo que tienes
          </Text>
          
          <View className="flex-row justify-around mt-4">
            <View className="items-center">
              <Text className="text-3xl font-bold text-food-orange">
                {cookableCount}
              </Text>
              <Text className="text-sm text-gray-600">Recetas listas</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-food-green">
                {pantryCount}
              </Text>
              <Text className="text-sm text-gray-600">Ingredientes</Text>
            </View>
          </View>
        </View>

        {/* Botón de escanear ingredientes */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ScanIngredients')}
          className="bg-food-orange rounded-xl p-4 mb-4 flex-row items-center justify-center shadow-md"
        >
          <Icon name="camera-outline" size={24} color="#FFFFFF" />
          <Text className="text-white text-lg font-semibold ml-2">
            Escanear Ingredientes
          </Text>
        </TouchableOpacity>

        {/* Accesos rápidos */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            className="bg-white rounded-xl p-4 flex-1 mr-2 items-center shadow-sm"
          >
            <Icon name="magnify-outline" size={24} color="#FF8C42" />
            <Text className="text-food-dark font-semibold mt-2">Buscar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Pantry')}
            className="bg-white rounded-xl p-4 flex-1 ml-2 items-center shadow-sm"
          >
            <Icon name="food-variant-outline" size={24} color="#FF8C42" />
            <Text className="text-food-dark font-semibold mt-2">Despensa</Text>
          </TouchableOpacity>
        </View>

        {/* Tiendas Cercanas */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-food-dark">
              Tiendas Cercanas
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
              <Text className="text-food-orange font-semibold">Ver todas</Text>
            </TouchableOpacity>
          </View>

          {storeError && (
            <View className="bg-red-100 border border-red-200 rounded-xl p-4 mb-3">
              <Text className="text-red-800 font-semibold">No se pudieron cargar las tiendas</Text>
              <Text className="text-red-700 mt-1">{storeError}</Text>
            </View>
          )}

          {!storeError && nearbyStores.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Icon name="store-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-600 mt-4 text-center">
                No se encontraron tiendas cercanas
              </Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                Activa la ubicación para ver tiendas cerca de ti
              </Text>
            </View>
          ) : (
            nearbyStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onPress={() => {
                  // TODO: Navegar a detalle de tienda cuando se implemente
                  console.log('Store pressed:', store.name);
                }}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

