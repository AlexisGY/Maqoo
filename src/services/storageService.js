import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'maqoo:token';

const CACHE_KEYS = {
  RECIPES: '@maqoo:recipes-cache',
  PANTRY: '@maqoo:pantry-cache',
  PREFERENCES: '@maqoo:preferences-cache',
  FAVORITES: '@maqoo:favorites-cache',
};

const APP_KEYS = {
  INITIALIZED: '@maqoo:initialized',
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

const readCache = async (key, fallback = null) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.warn('Cache read error', error);
    return fallback;
  }
};

const writeCache = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Cache write error', error);
  }
};

// =====================================================
//               AUTENTICACIÓN
// =====================================================

export const register = async (payload) => {
  const response = await api.post('/auth/register', payload);
  await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post('/auth/login', payload);
  await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
  return response.data;
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const getToken = async () => SecureStore.getItemAsync(TOKEN_KEY);

// =====================================================
//               GESTIÓN DE RECETAS
// =====================================================

export const getRecipes = async (params = {}) => {
  try {
    const response = await api.get('/recipes', { params });
    const items = response.data?.items ?? response.data ?? [];
    await writeCache(CACHE_KEYS.RECIPES, items);
    return items;
  } catch (error) {
    console.error('Error fetching recipes from API:', error.message);
    return readCache(CACHE_KEYS.RECIPES, []);
  }
};

export const addRecipe = async (recipe) => {
  const response = await api.post('/recipes', recipe);
  return response.data;
};

export const updateRecipe = async (recipeId, updatedRecipe) => {
  const response = await api.patch(`/recipes/${recipeId}`, updatedRecipe);
  return response.data;
};

export const deleteRecipe = async (recipeId) => {
  const response = await api.delete(`/recipes/${recipeId}`);
  return response.data;
};

// =====================================================
//               GESTIÓN DE DESPENSA
// =====================================================

const normalizeIngredient = (ingredient) =>
  typeof ingredient === 'string' ? ingredient.toLowerCase().trim() : ingredient.name?.toLowerCase().trim();

const resolvePantryItemId = async (name) => {
  const pantry = await api.get('/pantry');
  const normalized = normalizeIngredient(name);
  const match = pantry.data.find((item) => item.name === normalized);
  return match?.id;
};

export const getPantry = async () => {
  try {
    const response = await api.get('/pantry');
    const ingredients = response.data.map((item) => normalizeIngredient(item));
    await writeCache(CACHE_KEYS.PANTRY, ingredients);
    return ingredients;
  } catch (error) {
    console.error('Error fetching pantry from API:', error.message);
    return readCache(CACHE_KEYS.PANTRY, []);
  }
};

export const addIngredient = async (ingredient) => {
  try {
    const normalized = normalizeIngredient(ingredient);
    await api.post('/pantry', { name: normalized });
    return true;
  } catch (error) {
    console.error('Error adding ingredient:', error.message);
    return false;
  }
};

export const updateIngredient = async (id, ingredient) => {
  const response = await api.patch(`/pantry/${id}`, { name: normalizeIngredient(ingredient) });
  return response.data;
};

export const removeIngredient = async (ingredient) => {
  try {
    const itemId = await resolvePantryItemId(ingredient);
    if (itemId) {
      await api.delete(`/pantry/${itemId}`);
      return true;
    }
  } catch (error) {
    console.error('Error removing ingredient:', error.message);
  }
  return false;
};

export const clearPantry = async () => {
  try {
    const pantry = await api.get('/pantry');
    await Promise.all(pantry.data.map((item) => api.delete(`/pantry/${item.id}`)));
    await AsyncStorage.removeItem(CACHE_KEYS.PANTRY);
    return true;
  } catch (error) {
    console.error('Error clearing pantry:', error.message);
    await AsyncStorage.removeItem(CACHE_KEYS.PANTRY);
    return false;
  }
};

// =====================================================
//               PREFERENCIAS DEL USUARIO
// =====================================================

export const getPreferences = async () => {
  try {
    const response = await api.get('/preferences');
    await writeCache(CACHE_KEYS.PREFERENCES, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching preferences:', error.message);
    return readCache(CACHE_KEYS.PREFERENCES, {
      maxTime: null,
      healthy: null,
      economical: null,
    });
  }
};

export const savePreferences = async (preferences) => {
  const response = await api.patch('/preferences', preferences);
  await writeCache(CACHE_KEYS.PREFERENCES, response.data);
  return response.data;
};

// =====================================================
//               INICIALIZACIÓN
// =====================================================

export const isInitialized = async () => {
  try {
    const value = await AsyncStorage.getItem(APP_KEYS.INITIALIZED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking initialization:', error);
    return false;
  }
};

export const setInitialized = async () => {
  try {
    await AsyncStorage.setItem(APP_KEYS.INITIALIZED, 'true');
    return true;
  } catch (error) {
    console.error('Error setting initialization:', error);
    return false;
  }
};

// =====================================================
//               GESTIÓN DE FAVORITOS
// =====================================================

export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    const ids = response.data.map((favorite) => favorite.recipeId ?? favorite.recipe?.id);
    await writeCache(CACHE_KEYS.FAVORITES, ids);
    return ids;
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return readCache(CACHE_KEYS.FAVORITES, []);
  }
};

export const addFavorite = async (recipeId) => {
  const response = await api.post(`/favorites/${recipeId}/toggle`);
  return response.data;
};

export const removeFavorite = async (recipeId) => {
  const response = await api.post(`/favorites/${recipeId}/toggle`);
  return response.data;
};

export const isFavorite = async (recipeId) => {
  const favorites = await getFavorites();
  return Array.isArray(favorites) ? favorites.includes(recipeId) : false;
};

// =====================================================
//               LIMPIEZA (DEBUG)
// =====================================================

export const clearAllData = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
    await AsyncStorage.removeItem(APP_KEYS.INITIALIZED);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
