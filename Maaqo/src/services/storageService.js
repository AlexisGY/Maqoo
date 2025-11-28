import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  RECIPES: '@maaqo:recipes',
  PANTRY: '@maaqo:pantry',
  PREFERENCES: '@maaqo:preferences',
  INITIALIZED: '@maaqo:initialized',
  FAVORITES: '@maaqo:favorites',
};

// =====================================================
//               GESTIÓN DE RECETAS
// =====================================================

export const getRecipes = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

export const saveRecipes = async (recipes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error('Error saving recipes:', error);
    return false;
  }
};

export const addRecipe = async (recipe) => {
  try {
    const recipes = await getRecipes();
    recipes.push(recipe);
    await saveRecipes(recipes);
    return true;
  } catch (error) {
    console.error('Error adding recipe:', error);
    return false;
  }
};

export const updateRecipe = async (recipeId, updatedRecipe) => {
  try {
    const recipes = await getRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      await saveRecipes(recipes);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating recipe:', error);
    return false;
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const recipes = await getRecipes();
    const filtered = recipes.filter(r => r.id !== recipeId);
    await saveRecipes(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
};

// =====================================================
//               GESTIÓN DE DESPENSA
// =====================================================

export const getPantry = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PANTRY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pantry:', error);
    return [];
  }
};

export const savePantry = async (ingredients) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(ingredients));
    return true;
  } catch (error) {
    console.error('Error saving pantry:', error);
    return false;
  }
};

export const addIngredient = async (ingredient) => {
  try {
    const pantry = await getPantry();
    const normalized = ingredient.toLowerCase().trim();
    if (!pantry.includes(normalized)) {
      pantry.push(normalized);
      await savePantry(pantry);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding ingredient:', error);
    return false;
  }
};

export const removeIngredient = async (ingredient) => {
  try {
    const pantry = await getPantry();
    const normalized = ingredient.toLowerCase().trim();
    const filtered = pantry.filter(ing => ing !== normalized);
    await savePantry(filtered);
    return true;
  } catch (error) {
    console.error('Error removing ingredient:', error);
    return false;
  }
};

export const clearPantry = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PANTRY);
    return true;
  } catch (error) {
    console.error('Error clearing pantry:', error);
    return false;
  }
};

// =====================================================
//               PREFERENCIAS DEL USUARIO
// =====================================================

export const getPreferences = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      maxTime: null,
      healthy: null,
      economical: null,
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {
      maxTime: null,
      healthy: null,
      economical: null,
    };
  }
};

export const savePreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

// =====================================================
//               INICIALIZACIÓN
// =====================================================

export const isInitialized = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking initialization:', error);
    return false;
  }
};

export const setInitialized = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
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
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

export const removeFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter(id => id !== recipeId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

export const isFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(recipeId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// =====================================================
//               LIMPIEZA (DEBUG)
// =====================================================

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.RECIPES,
      STORAGE_KEYS.PANTRY,
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.INITIALIZED,
      STORAGE_KEYS.FAVORITES,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

