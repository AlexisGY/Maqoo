import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const StoreCard = ({ store, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Si no hay onPress personalizado, mostrar el modal por defecto
    handleStorePress();
  };

  const handleStorePress = () => {
    const options = [];
    
    if (store.address && store.address !== 'Dirección no disponible') {
      options.push({
        text: 'Copiar dirección',
        onPress: async () => {
          try {
            // Intentar usar expo-clipboard si está disponible
            const Clipboard = require('expo-clipboard');
            await Clipboard.setStringAsync(store.address);
            Alert.alert('Éxito', 'Dirección copiada al portapapeles');
          } catch (error) {
            // Si expo-clipboard no está disponible, mostrar la dirección para que el usuario la copie manualmente
            Alert.alert(
              'Dirección',
              `${store.address}\n\n(Puedes seleccionar y copiar esta dirección)`,
              [{ text: 'OK' }]
            );
          }
        },
      });
    }

    if (store.location?.lat && store.location?.lng) {
      options.push({
        text: 'Abrir en Maps',
        onPress: async () => {
          const { lat, lng } = store.location;
          
          // Intentar diferentes URLs según la plataforma
          const urls = Platform.OS === 'ios' 
            ? [
                `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
                `maps://app?daddr=${lat},${lng}&dirflg=d`,
              ]
            : [
                `google.navigation:q=${lat},${lng}`,
                `geo:${lat},${lng}?q=${lat},${lng}`,
              ];
          
          // Agregar fallback web para ambos
          urls.push(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
          
          let opened = false;
          for (const url of urls) {
            try {
              const canOpen = await Linking.canOpenURL(url);
              if (canOpen) {
                await Linking.openURL(url);
                opened = true;
                break;
              }
            } catch (error) {
              // Continuar con la siguiente URL
              continue;
            }
          }
          
          if (!opened) {
            // Último fallback: abrir en navegador web
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
          }
        },
      });
    }

    if (options.length === 0) {
      Alert.alert(store.name, 'No hay opciones disponibles para esta tienda');
      return;
    }

    options.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert(store.name, '¿Qué deseas hacer?', options);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
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
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Icon name="star" size={16} color="#FFD23F" />
            <Text className="ml-1 text-sm text-food-dark font-semibold">
              {store.rating ?? 'N/D'}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Icon name="map-marker-distance" size={16} color="#FF8C42" />
            <Text className="ml-1 text-sm text-food-dark">
              {store.distance}
            </Text>
          </View>
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

