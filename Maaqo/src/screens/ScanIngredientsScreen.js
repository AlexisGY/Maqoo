import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const ScanIngredientsScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleTakePicture = async () => {
    if (!cameraRef) return;

    setIsScanning(true);
    try {
      const photo = await cameraRef.takePictureAsync();
      
      // Placeholder para funcionalidad futura de IA
      Alert.alert(
        'Próximamente',
        'La funcionalidad de análisis de alimentos con IA estará disponible pronto.\n\n' +
        'En el futuro, podrás:\n' +
        '• Detectar ingredientes automáticamente\n' +
        '• Ver recetas recomendadas basadas en lo detectado\n' +
        '• Agregar ingredientes a tu despensa automáticamente',
        [{ text: 'Entendido' }]
      );
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsScanning(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light">
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text className="mt-4 text-gray-600">Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light p-4">
        <Icon name="camera-off-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-food-dark mt-4 mb-2">
          Permiso de cámara denegado
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          Necesitas permitir el acceso a la cámara para escanear ingredientes
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-food-orange px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-semibold">Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={styles.camera}
        facing="back"
        ref={ref => setCameraRef(ref)}
      >
        <View className="flex-1 justify-end pb-8">
          {/* Overlay con información */}
          <View className="bg-black/50 p-4 mb-4">
            <View className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-2">
              <View className="flex-row items-center mb-1">
                <Icon name="information-outline" size={20} color="#FCD34D" />
                <Text className="text-yellow-200 font-semibold ml-2">
                  Próximamente
                </Text>
              </View>
              <Text className="text-yellow-100 text-sm">
                Análisis de alimentos con IA estará disponible pronto
              </Text>
            </View>
            <Text className="text-white text-sm text-center">
              Toma una foto de tus ingredientes para analizarlos
            </Text>
          </View>

          {/* Botón de captura */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleTakePicture}
              disabled={isScanning}
              className="bg-food-orange rounded-full p-4 shadow-lg"
              style={styles.captureButton}
            >
              {isScanning ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Icon name="camera-outline" size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanIngredientsScreen;

