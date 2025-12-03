import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const IngredientTag = ({ ingredient, onRemove, available = false }) => {
  return (
    <View
      className={`px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center ${
        available ? 'bg-green-100' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-sm ${
          available ? 'text-green-800' : 'text-gray-700'
        }`}
      >
        {ingredient}
      </Text>
      {onRemove && (
        <TouchableOpacity
          onPress={() => onRemove(ingredient)}
          className="ml-2"
        >
          <Text className="text-gray-500 text-lg">×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IngredientTag;

