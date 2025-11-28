import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import IngredientTag from '../components/IngredientTag';
import StatusBadge from '../components/StatusBadge';
import { getRecipeDetails } from '../services/recipeService';
import { getPantry, isFavorite, addFavorite, removeFavorite } from '../services/storageService';

const RecipeDetailScreen = () => {
  const route = useRoute();
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [pantry, setPantry] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipeDetails();
    checkFavorite();
  }, [recipeId]);

  const checkFavorite = async () => {
    const isFav = await isFavorite(recipeId);
    setFavorite(isFav);
  };

  const handleFavoritePress = async () => {
    if (favorite) {
      await removeFavorite(recipeId);
      setFavorite(false);
    } else {
      await addFavorite(recipeId);
      setFavorite(true);
    }
  };

  const loadRecipeDetails = async () => {
    try {
      const [details, pantryList] = await Promise.all([
        getRecipeDetails(recipeId),
        getPantry(),
      ]);
      
      setRecipe(details);
      setPantry(pantryList);
    } catch (error) {
      console.error('Error loading recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  const isIngredientAvailable = (ingredient) => {
    return pantry.some(
      p => p.toLowerCase().trim() === ingredient.toLowerCase().trim()
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light">
        <Text className="text-gray-600">Receta no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-food-light">
      <View className="p-4">
        {/* Header */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold text-food-dark flex-1 mr-2">
              {recipe.nombre}
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={handleFavoritePress}
                className="p-2"
              >
                <Icon
                  name={favorite ? 'star' : 'star-outline'}
                  size={28}
                  color={favorite ? '#FFD23F' : '#9CA3AF'}
                />
              </TouchableOpacity>
              <StatusBadge status={recipe.status} />
            </View>
          </View>

          <View className="flex-row items-center mb-2">
            <Icon name="clock-outline" size={20} color="#264653" />
            <Text className="ml-2 text-food-dark font-semibold">
              {recipe.tiempo} minutos
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3 mt-2">
            {recipe.saludable && (
              <View className="flex-row items-center">
                <Icon name="leaf-outline" size={18} color="#2A9D8F" />
                <Text className="ml-1 text-food-dark">Saludable</Text>
              </View>
            )}
            {recipe.economico && (
              <View className="flex-row items-center">
                <Icon name="cash-outline" size={18} color="#FF8C42" />
                <Text className="ml-1 text-food-dark">Económico</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ingredientes */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-food-dark mb-3">
            Ingredientes
          </Text>
          
          {recipe.match && recipe.match.missingCount > 0 && (
            <View className="bg-yellow-50 rounded-lg p-3 mb-3">
              <Text className="text-yellow-800 text-sm">
                Faltan {recipe.match.missingCount} ingrediente(s)
              </Text>
            </View>
          )}

          <View className="flex-row flex-wrap">
            {recipe.ingredientes.map((ingredient, index) => (
              <IngredientTag
                key={index}
                ingredient={ingredient}
                available={isIngredientAvailable(ingredient)}
              />
            ))}
          </View>
        </View>

        {/* Información adicional */}
        {recipe.match && (
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-xl font-bold text-food-dark mb-3">
              Disponibilidad
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Ingredientes disponibles:</Text>
              <Text className="text-food-dark font-semibold">
                {recipe.match.availableCount} / {recipe.match.totalCount}
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2 mt-2">
              <View
                className="bg-food-green rounded-full h-2"
                style={{
                  width: `${recipe.match.matchPercentage}%`,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipeDetailScreen;

