import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const StoreCard = ({ store, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
      style={styles.card}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-bold text-food-dark" numberOfLines={1}>
              {store.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="map-marker-outline" size={14} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-600" numberOfLines={1}>
                {store.address}
              </Text>
            </View>
          </View>
          {store.open ? (
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-green-800">Abierto</Text>
            </View>
          ) : (
            <View className="bg-red-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-red-800">Cerrado</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Icon name="star" size={16} color="#FFD23F" />
            <Text className="ml-1 text-sm text-food-dark font-semibold">
              {store.rating}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Icon name="map-marker-distance" size={16} color="#FF8C42" />
            <Text className="ml-1 text-sm text-food-dark">
              {store.distance}
            </Text>
          </View>
        </View>

        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            {store.hours}
          </Text>
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

export default StoreCard;

