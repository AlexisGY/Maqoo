import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const StoreCard = ({ store, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Si no hay onPress personalizado, mostrar el modal por defecto
    setModalVisible(true);
  };

  const handleCopyAddress = () => {
    // Mostrar la dirección para que el usuario la copie manualmente
    setModalVisible(false);
    Alert.alert(
      'Dirección',
      `${store.address}\n\nPuedes seleccionar y copiar esta dirección`,
      [{ text: 'OK' }]
    );
  };

  const handleOpenMaps = async () => {
    setModalVisible(false);
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
        continue;
      }
    }
    
    if (!opened) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    }
  };

  return (
    <>
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

      {/* Modal personalizado */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Icon name="store-outline" size={24} color="#FF8C42" />
              <Text style={styles.modalTitle}>{store.name}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Dirección */}
            {store.address && store.address !== 'Dirección no disponible' && (
              <View style={styles.modalAddress}>
                <Icon name="map-marker-outline" size={18} color="#9CA3AF" />
                <Text style={styles.modalAddressText}>{store.address}</Text>
              </View>
            )}

            {/* Opciones */}
            <View style={styles.modalOptions}>
              {store.address && store.address !== 'Dirección no disponible' && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleCopyAddress}
                >
                  <View style={styles.modalOptionIcon}>
                    <Icon name="content-copy" size={24} color="#FF8C42" />
                  </View>
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionTitle}>Copiar dirección</Text>
                    <Text style={styles.modalOptionSubtitle}>Copia la dirección al portapapeles</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              )}

              {store.location?.lat && store.location?.lng && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleOpenMaps}
                >
                  <View style={styles.modalOptionIcon}>
                    <Icon name="map-outline" size={24} color="#FF8C42" />
                  </View>
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionTitle}>Abrir en Maps</Text>
                    <Text style={styles.modalOptionSubtitle}>Abre la ubicación en tu app de mapas</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Botón cancelar */}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#264653',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalAddressText: {
    flex: 1,
    fontSize: 14,
    color: '#264653',
    marginLeft: 12,
    lineHeight: 20,
  },
  modalOptions: {
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#264653',
    marginBottom: 4,
  },
  modalOptionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalCancelButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default StoreCard;

