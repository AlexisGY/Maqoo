import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { isFavorite, addFavorite, removeFavorite } from '../services/storageService';

const RecipeCard = ({ recipe, onPress, status = 'sugerida', onFavoriteChange }) => {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [recipe.id]);

  const checkFavorite = async () => {
    const isFav = await isFavorite(recipe.id);
    setFavorite(isFav);
  };

  const handleFavoritePress = async (e) => {
    e.stopPropagation();
    if (favorite) {
      await removeFavorite(recipe.id);
      setFavorite(false);
    } else {
      await addFavorite(recipe.id);
      setFavorite(true);
    }
    // Notificar cambio de favorito
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };
  const getStatusColor = () => {
    switch (status) {
      case 'cocinable':
        return '#2A9D8F'; // Verde
      case 'casi_cocinable':
        return '#FF8C42'; // Naranja
      default:
        return '#9CA3AF'; // Gris
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'cocinable':
        return 'Listo para cocinar';
      case 'casi_cocinable':
        return 'Casi listo';
      default:
        return 'Sugerida';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
      style={styles.card}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-bold text-food-dark flex-1 mr-2" numberOfLines={2}>
            {recipe.nombre}
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleFavoritePress}
              className="p-1"
            >
              <Icon
                name={favorite ? 'star' : 'star-outline'}
                size={24}
                color={favorite ? '#FFD23F' : '#9CA3AF'}
              />
            </TouchableOpacity>
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor() + '20' }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: getStatusColor() }}
              >
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <Icon name="clock-outline" size={16} color="#264653" />
          <Text className="ml-1 text-sm text-food-dark">
            {recipe.tiempo} min
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {recipe.saludable && (
            <View className="flex-row items-center">
              <Icon name="leaf-outline" size={14} color="#2A9D8F" />
              <Text className="ml-1 text-xs text-food-dark">Saludable</Text>
            </View>
          )}
          {recipe.economico && (
            <View className="flex-row items-center">
              <Icon name="cash-outline" size={14} color="#FF8C42" />
              <Text className="ml-1 text-xs text-food-dark">Económico</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default RecipeCard;

