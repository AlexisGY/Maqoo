import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const SearchBar = ({ onSearch, placeholder = 'Buscar recetas...' }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Debounce de 500ms
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm mb-4">
      <Icon name="magnify-outline" size={20} color="#9CA3AF" />
      <TextInput
        className="flex-1 ml-3 text-base text-food-dark"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Icon name="close-circle-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

