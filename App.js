import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import PantryScreen from './src/screens/PantryScreen';
import ScanIngredientsScreen from './src/screens/ScanIngredientsScreen';
import StoreListScreen from './src/screens/StoreListScreen';
import LoginScreen from './src/screens/LoginScreen';

import { isInitialized, setInitialized, saveRecipes, getToken } from './src/services/storageService';
import { initialRecipes } from './src/data/initialRecipes';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const initialized = await isInitialized();
      const token = await getToken();
      setHasToken(Boolean(token));

      if (!initialized) {
        // Migrar recetas iniciales
        await saveRecipes(initialRecipes);
        await setInitialized();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-food-light">
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text className="mt-4 text-food-dark text-lg">Cargando Maqoo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName={hasToken ? 'Home' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFF8E7',
            },
            headerTintColor: '#264653',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            options={{ title: 'Bienvenido', headerShown: false }}
          >
            {(props) => (
              <LoginScreen
                {...props}
                onAuthSuccess={() => setHasToken(true)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Maqoo' }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ title: 'Buscar Recetas' }}
          />
          <Stack.Screen 
            name="RecipeDetail" 
            component={RecipeDetailScreen}
            options={{ title: 'Detalle de Receta' }}
          />
          <Stack.Screen 
            name="Pantry" 
            component={PantryScreen}
            options={{ title: 'Mi Despensa' }}
          />
          <Stack.Screen
            name="ScanIngredients"
            component={ScanIngredientsScreen}
            options={{ title: 'Escanear Ingredientes' }}
          />
          <Stack.Screen
            name="Stores"
            component={StoreListScreen}
            options={{ title: 'Tiendas Cercanas' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
