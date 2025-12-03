import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import IngredientTag from '../components/IngredientTag';
import {
  getPantry,
  addIngredient,
  removeIngredient,
  clearPantry,
} from '../services/storageService';

const PantryScreen = () => {
  const [pantry, setPantry] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadPantry();
    }, [])
  );

  const loadPantry = async () => {
    const ingredients = await getPantry();
    setPantry(ingredients);
  };

  const handleAddIngredient = async () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;

    const success = await addIngredient(trimmed);
    if (success) {
      setNewIngredient('');
      await loadPantry();
    } else {
      Alert.alert('Error', 'No se pudo agregar el ingrediente');
    }
  };

  const handleRemoveIngredient = async (ingredient) => {
    await removeIngredient(ingredient);
    await loadPantry();
  };

  const handleClearPantry = () => {
    Alert.alert(
      'Limpiar Despensa',
      '¿Estás seguro de que quieres eliminar todos los ingredientes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await clearPantry();
            await loadPantry();
          },
        },
      ]
    );
  };

  const filteredPantry = pantry.filter(ingredient =>
    ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const commonIngredients = [
    'arroz',
    'huevo',
    'aceite',
    'sal',
    'pollo',
    'papa',
    'cebolla',
    'tomate',
    'ajo',
    'limón',
  ];

  return (
    <ScrollView className="flex-1 bg-food-light">
      <View className="p-4">
        {/* Agregar ingrediente */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-food-dark mb-3">
            Agregar Ingrediente
          </Text>
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-food-dark"
              placeholder="Ej: arroz, pollo, papa..."
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={handleAddIngredient}
            />
            <TouchableOpacity
              onPress={handleAddIngredient}
              className="bg-food-orange rounded-lg px-4 py-3 ml-2"
            >
              <Icon name="plus-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Búsqueda */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Icon name="magnify-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-food-dark"
              placeholder="Buscar ingrediente..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Ingredientes comunes */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-food-dark mb-2">
            Ingredientes Comunes
          </Text>
          <View className="flex-row flex-wrap">
            {commonIngredients
              .filter(ing => !pantry.includes(ing))
              .map(ingredient => (
                <TouchableOpacity
                  key={ingredient}
                  onPress={async () => {
                    await addIngredient(ingredient);
                    await loadPantry();
                  }}
                  className="bg-white rounded-full px-4 py-2 mr-2 mb-2 shadow-sm"
                >
                  <Text className="text-food-dark">{ingredient}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Lista de ingredientes */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-food-dark">
              Mi Despensa ({filteredPantry.length})
            </Text>
            {pantry.length > 0 && (
              <TouchableOpacity onPress={handleClearPantry}>
                <Text className="text-red-500 font-semibold">Limpiar</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredPantry.length === 0 ? (
            <View className="items-center py-8">
              <Icon name="food-variant-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-600 mt-4 text-center">
                {searchQuery
                  ? 'No se encontraron ingredientes'
                  : 'Tu despensa está vacía'}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap">
              {filteredPantry.map((ingredient, index) => (
                <IngredientTag
                  key={index}
                  ingredient={ingredient}
                  onRemove={handleRemoveIngredient}
                  available={true}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default PantryScreen;

