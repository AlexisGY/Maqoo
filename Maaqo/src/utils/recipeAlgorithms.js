// Algoritmos mejorados para búsqueda, matching y scoring de recetas

/**
 * Normaliza un string para comparación (lowercase, trim, sin acentos)
 */
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Calcula el porcentaje de ingredientes disponibles para una receta
 */
export const calculateIngredientMatch = (recipe, pantry) => {
  const recipeIngredients = recipe.ingredientes.map(normalizeString);
  const pantryNormalized = pantry.map(normalizeString);
  
  const available = recipeIngredients.filter(ing => 
    pantryNormalized.includes(ing)
  );
  
  const matchPercentage = (available.length / recipeIngredients.length) * 100;
  const missingCount = recipeIngredients.length - available.length;
  
  return {
    matchPercentage,
    missingCount,
    availableCount: available.length,
    totalCount: recipeIngredients.length,
    missingIngredients: recipeIngredients.filter(ing => 
      !pantryNormalized.includes(ing)
    ),
  };
};

/**
 * Determina el estado de una receta según los ingredientes disponibles
 */
export const getRecipeStatus = (recipe, pantry) => {
  const match = calculateIngredientMatch(recipe, pantry);
  
  if (match.missingCount === 0) {
    return 'cocinable'; // 100% cocinable
  } else if (match.missingCount <= 2) {
    return 'casi_cocinable'; // Falta 1-2 ingredientes
  } else {
    return 'sugerida'; // Falta 3+ ingredientes
  }
};

/**
 * Calcula el score de una receta basado en múltiples factores
 */
export const calculateRecipeScore = (recipe, pantry, preferences = {}) => {
  const match = calculateIngredientMatch(recipe, pantry);
  const status = getRecipeStatus(recipe, pantry);
  
  let score = 0;
  
  // Factor 1: Porcentaje de ingredientes disponibles (0-50 puntos)
  score += (match.matchPercentage / 100) * 50;
  
  // Factor 2: Estado de la receta (bonus)
  if (status === 'cocinable') {
    score += 30; // Bonus por ser completamente cocinable
  } else if (status === 'casi_cocinable') {
    score += 15; // Bonus por estar cerca
  }
  
  // Factor 3: Preferencias del usuario (0-20 puntos)
  if (preferences.maxTime && recipe.tiempo <= preferences.maxTime) {
    score += 10;
  }
  
  if (preferences.healthy !== null) {
    if (preferences.healthy === recipe.saludable) {
      score += 5;
    }
  }
  
  if (preferences.economical !== null) {
    if (preferences.economical === recipe.economico) {
      score += 5;
    }
  }
  
  // Factor 4: Tiempo (preferir recetas más rápidas si hay tiempo limitado)
  if (preferences.maxTime) {
    const timeRatio = recipe.tiempo / preferences.maxTime;
    if (timeRatio <= 1) {
      score += (1 - timeRatio) * 10; // Más puntos si es más rápido
    }
  }
  
  return {
    score,
    status,
    match,
  };
};

/**
 * Búsqueda fuzzy de recetas por nombre
 */
export const fuzzySearch = (query, recipes) => {
  if (!query || query.trim() === '') {
    return recipes;
  }
  
  const normalizedQuery = normalizeString(query);
  const queryWords = normalizedQuery.split(/\s+/);
  
  return recipes.filter(recipe => {
    const normalizedName = normalizeString(recipe.nombre);
    
    // Búsqueda exacta
    if (normalizedName.includes(normalizedQuery)) {
      return true;
    }
    
    // Búsqueda por palabras
    return queryWords.every(word => 
      normalizedName.includes(word) ||
      recipe.ingredientes.some(ing => 
        normalizeString(ing).includes(word)
      )
    );
  });
};

/**
 * Filtra recetas según criterios
 */
export const filterRecipes = (recipes, filters = {}) => {
  return recipes.filter(recipe => {
    // Filtro de tiempo
    if (filters.maxTime && recipe.tiempo > filters.maxTime) {
      return false;
    }
    
    // Filtro de saludable
    if (filters.healthy !== null && filters.healthy !== undefined) {
      if (recipe.saludable !== filters.healthy) {
        return false;
      }
    }
    
    // Filtro de económico
    if (filters.economical !== null && filters.economical !== undefined) {
      if (recipe.economico !== filters.economical) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Ordena recetas por relevancia
 */
export const sortRecipesByRelevance = (recipes, pantry, preferences = {}) => {
  return recipes
    .map(recipe => ({
      recipe,
      ...calculateRecipeScore(recipe, pantry, preferences),
    }))
    .sort((a, b) => {
      // Primero por score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      // Luego por estado (cocinable > casi_cocinable > sugerida)
      const statusOrder = { cocinable: 3, casi_cocinable: 2, sugerida: 1 };
      if (statusOrder[b.status] !== statusOrder[a.status]) {
        return statusOrder[b.status] - statusOrder[a.status];
      }
      
      // Finalmente por tiempo (más rápido primero)
      return a.recipe.tiempo - b.recipe.tiempo;
    });
};

/**
 * Obtiene recetas cocinables
 */
export const getCookableRecipes = (recipes, pantry) => {
  return recipes.filter(recipe => 
    getRecipeStatus(recipe, pantry) === 'cocinable'
  );
};

/**
 * Obtiene recetas casi cocinables (falta 1-2 ingredientes)
 */
export const getAlmostCookableRecipes = (recipes, pantry) => {
  return recipes
    .map(recipe => ({
      recipe,
      match: calculateIngredientMatch(recipe, pantry),
      status: getRecipeStatus(recipe, pantry),
    }))
    .filter(item => item.status === 'casi_cocinable')
    .sort((a, b) => a.match.missingCount - b.match.missingCount);
};

/**
 * Busca y filtra recetas con todos los algoritmos combinados
 */
export const searchAndFilterRecipes = (recipes, pantry, searchQuery = '', filters = {}, preferences = {}) => {
  // 1. Búsqueda fuzzy
  let results = fuzzySearch(searchQuery, recipes);
  
  // 2. Filtrado
  results = filterRecipes(results, filters);
  
  // 3. Scoring y ordenamiento
  const scored = sortRecipesByRelevance(results, pantry, preferences);
  
  return scored.map(item => ({
    ...item.recipe,
    score: item.score,
    status: item.status,
    match: item.match,
  }));
};

