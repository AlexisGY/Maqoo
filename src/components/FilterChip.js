import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const FilterChip = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
        active ? 'bg-food-orange' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${
          active ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterChip;

