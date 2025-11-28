import { getRecipes, getPantry, getPreferences, getFavorites } from './storageService';
import {
  searchAndFilterRecipes,
  getCookableRecipes,
  getAlmostCookableRecipes,
  calculateRecipeScore,
  getRecipeStatus,
} from '../utils/recipeAlgorithms';

/**
 * Obtiene todas las recetas con su estado calculado
 */
export const getAllRecipesWithStatus = async () => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  
  return recipes.map(recipe => ({
    ...recipe,
    status: getRecipeStatus(recipe, pantry),
    score: calculateRecipeScore(recipe, pantry).score,
  }));
};

/**
 * Busca recetas con query y filtros
 */
export const searchRecipes = async (searchQuery = '', filters = {}) => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  const preferences = await getPreferences();
  
  let results = searchAndFilterRecipes(recipes, pantry, searchQuery, filters, preferences);
  
  // Filtrar por favoritos si está activo
  if (filters.favoritesOnly) {
    const favorites = await getFavorites();
    results = results.filter(recipe => favorites.includes(recipe.id));
  }
  
  return results;
};

/**
 * Obtiene recetas cocinables
 */
export const getCookableRecipesList = async () => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  
  return getCookableRecipes(recipes, pantry);
};

/**
 * Obtiene recetas casi cocinables
 */
export const getAlmostCookableRecipesList = async () => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  
  return getAlmostCookableRecipes(recipes, pantry);
};

/**
 * Obtiene recetas destacadas para el home
 */
export const getFeaturedRecipes = async (limit = 6) => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  const preferences = await getPreferences();
  
  // Priorizar recetas cocinables
  const cookable = getCookableRecipes(recipes, pantry);
  
  if (cookable.length >= limit) {
    return cookable.slice(0, limit);
  }
  
  // Si no hay suficientes cocinables, agregar casi cocinables
  const almost = getAlmostCookableRecipes(recipes, pantry);
  const combined = [
    ...cookable,
    ...almost.slice(0, limit - cookable.length).map(item => item.recipe),
  ];
  
  return combined.slice(0, limit);
};

/**
 * Obtiene detalles de una receta con información de disponibilidad
 */
export const getRecipeDetails = async (recipeId) => {
  const recipes = await getRecipes();
  const pantry = await getPantry();
  
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) {
    return null;
  }
  
  const { calculateIngredientMatch } = require('../utils/recipeAlgorithms');
  const match = calculateIngredientMatch(recipe, pantry);
  const status = getRecipeStatus(recipe, pantry);
  
  return {
    ...recipe,
    status,
    match,
  };
};

/**
 * Obtiene todas las recetas favoritas
 */
export const getFavoriteRecipes = async () => {
  const recipes = await getRecipes();
  const favorites = await getFavorites();
  const pantry = await getPantry();
  const preferences = await getPreferences();
  
  // Filtrar solo las recetas favoritas
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
  
  // Aplicar algoritmos de scoring y ordenamiento
  return searchAndFilterRecipes(favoriteRecipes, pantry, '', {}, preferences);
};

