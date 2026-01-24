import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { recognizeIngredients } from '../services/ingredientRecognitionService';
import { addIngredient } from '../services/storageService';

const ScanIngredientsScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTakePicture = async () => {
    if (!cameraRef) return;

    setIsScanning(true);
    setErrorMessage(null);
    try {
      const photo = await cameraRef.takePictureAsync({ quality: 0.6 });
      const response = await recognizeIngredients(photo.uri);
      const ingredients = response?.ingredients ?? [];
      setDetectedIngredients(ingredients);

      if (!ingredients.length) {
        Alert.alert(
          'Sin ingredientes detectados',
          'No pudimos reconocer ingredientes en la foto. Intenta con mejor iluminacion o enfoca solo los alimentos.',
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      setDetectedIngredients([]);
      setErrorMessage('No se pudo analizar la imagen. Intenta nuevamente.');
      Alert.alert('Error', 'No se pudo analizar la foto. Revisa tu conexion o intenta nuevamente.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddIngredient = async (ingredient) => {
    if (!ingredient?.name) return;
    setSelectedIngredient(ingredient.name);
    try {
      const added = await addIngredient(ingredient.name);
      if (added) {
        Alert.alert('Agregado', `${ingredient.name} se agrego a tu despensa.`);
      } else {
        Alert.alert('Aviso', 'No se pudo guardar el ingrediente en tu despensa.');
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      Alert.alert('Error', 'No se pudo guardar el ingrediente.');
    } finally {
      setSelectedIngredient(null);
    }
  };

  const handleAddAll = async () => {
    if (!detectedIngredients.length) return;
    setSelectedIngredient('all');
    try {
      await Promise.all(detectedIngredients.map((ingredient) => addIngredient(ingredient.name)));
      Alert.alert('Agregado', 'Todos los ingredientes detectados se agregaron a tu despensa.');
    } catch (error) {
      console.error('Error adding all ingredients:', error);
      Alert.alert('Error', 'No se pudieron guardar todos los ingredientes.');
    } finally {
      setSelectedIngredient(null);
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
        <Text className="text-xl font-bold text-food-dark mt-4 mb-2">Permiso de camara denegado</Text>
        <Text className="text-gray-600 text-center mb-4">
          Necesitas permitir el acceso a la camara para escanear ingredientes
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-food-orange px-6 py-3 rounded-full mt-4">
          <Text className="text-white font-semibold">Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView style={styles.camera} facing="back" ref={(ref) => setCameraRef(ref)}>
        <View className="flex-1 justify-end pb-8">
          {/* Overlay con resultados */}
          <View className="bg-black/50 p-4 mb-4 max-h-60">
            <View className="flex-row items-center mb-3 justify-between">
              <View className="flex-row items-center">
                <Icon name="brain" size={22} color="#FCD34D" />
                <Text className="text-yellow-200 font-semibold ml-2">Analisis de ingredientes con IA</Text>
              </View>
              {detectedIngredients.length > 0 && (
                <TouchableOpacity
                  onPress={handleAddAll}
                  disabled={selectedIngredient === 'all'}
                  className="bg-food-orange px-3 py-2 rounded-full"
                >
                  {selectedIngredient === 'all' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white text-sm font-semibold">Agregar todo</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {errorMessage && (
              <View className="bg-red-500/20 border border-red-400 rounded-lg p-3 mb-3">
                <Text className="text-red-100">{errorMessage}</Text>
              </View>
            )}

            {detectedIngredients.length === 0 ? (
              <Text className="text-white text-sm text-center">
                Toma una foto de tus ingredientes para analizarlos automaticamente.
              </Text>
            ) : (
              <ScrollView className="max-h-32" showsVerticalScrollIndicator={false}>
                {detectedIngredients.map((ingredient, index) => (
                  <View
                    key={`${ingredient.name}-${index}`}
                    className="flex-row justify-between items-center bg-white/10 rounded-lg p-3 mb-2"
                  >
                    <View className="flex-row items-center">
                      <Icon name="food-apple-outline" size={20} color="#FCD34D" />
                      <View className="ml-2">
                        <Text className="text-white font-semibold capitalize">{ingredient.name}</Text>
                        <Text className="text-gray-200 text-xs">
                          Confianza: {Math.round((ingredient.confidence ?? 0) * 100)}%
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleAddIngredient(ingredient)}
                      disabled={selectedIngredient === ingredient.name}
                      className="bg-white/20 px-3 py-1 rounded-full"
                    >
                      {selectedIngredient === ingredient.name ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white text-sm">Agregar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Boton de captura */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleTakePicture}
              disabled={isScanning}
              className="bg-food-orange rounded-full p-4 shadow-lg"
              style={styles.captureButton}
            >
              {isScanning ? <ActivityIndicator size="large" color="#FFFFFF" /> : <Icon name="camera-outline" size={32} color="#FFFFFF" />}
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
