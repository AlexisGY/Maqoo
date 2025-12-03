import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import { searchRecipes } from '../services/recipeService';

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    maxTime: null,
    healthy: null,
    economical: null,
    favoritesOnly: route.params?.showFavorites || false,
  });
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    performSearch();
  }, [searchQuery, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchRecipes(searchQuery, filters);
      setRecipes(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilter = (time) => {
    setFilters(prev => ({
      ...prev,
      maxTime: prev.maxTime === time ? null : time,
    }));
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === null ? true : prev[key] === true ? false : null,
    }));
  };

  return (
    <View className="flex-1 bg-food-light">
      <View className="p-4">
        <SearchBar onSearch={setSearchQuery} />
        
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center justify-between bg-white rounded-xl p-3 mb-4 shadow-sm"
        >
          <Text className="text-food-dark font-semibold">Filtros</Text>
          <Icon
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#264653"
          />
        </TouchableOpacity>

        {showFilters && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            {/* Filtro de tiempo */}
            <Text className="text-food-dark font-semibold mb-2">Tiempo máximo</Text>
            <View className="flex-row flex-wrap mb-4">
              <FilterChip
                label="15 min"
                active={filters.maxTime === 15}
                onPress={() => handleTimeFilter(15)}
              />
              <FilterChip
                label="30 min"
                active={filters.maxTime === 30}
                onPress={() => handleTimeFilter(30)}
              />
              <FilterChip
                label="45 min"
                active={filters.maxTime === 45}
                onPress={() => handleTimeFilter(45)}
              />
              <FilterChip
                label="60 min"
                active={filters.maxTime === 60}
                onPress={() => handleTimeFilter(60)}
              />
            </View>

            {/* Filtro saludable */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-food-dark font-semibold">Saludable</Text>
              <Switch
                value={filters.healthy === true}
                onValueChange={() => toggleFilter('healthy')}
                trackColor={{ false: '#D1D5DB', true: '#2A9D8F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Filtro económico */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-food-dark font-semibold">Económico</Text>
              <Switch
                value={filters.economical === true}
                onValueChange={() => toggleFilter('economical')}
                trackColor={{ false: '#D1D5DB', true: '#FF8C42' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Filtro de favoritos */}
            <View className="flex-row items-center justify-between border-t border-gray-200 pt-4">
              <View className="flex-row items-center">
                <Icon name="star" size={20} color="#FFD23F" />
                <Text className="text-food-dark font-semibold ml-2">Solo Favoritos</Text>
              </View>
              <Switch
                value={filters.favoritesOnly}
                onValueChange={(value) => setFilters(prev => ({ ...prev, favoritesOnly: value }))}
                trackColor={{ false: '#D1D5DB', true: '#FFD23F' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        )}

        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-600">Buscando recetas...</Text>
          </View>
        ) : recipes.length === 0 ? (
          <View className="items-center py-8">
            {filters.favoritesOnly ? (
              <>
                <Icon name="star-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-600 mt-4 text-center font-semibold">
                  No tienes recetas favoritas
                </Text>
                <Text className="text-gray-500 mt-2 text-center text-sm">
                  Marca recetas con la estrella para agregarlas a favoritos
                </Text>
              </>
            ) : (
              <>
                <Icon name="chef-hat-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-600 mt-4 text-center">
                  No se encontraron recetas
                </Text>
              </>
            )}
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                status={recipe.status}
                onPress={() =>
                  navigation.navigate('RecipeDetail', { recipeId: recipe.id })
                }
                onFavoriteChange={() => {
                  // Recargar resultados si el filtro de favoritos está activo
                  if (filters.favoritesOnly) {
                    performSearch();
                  }
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

