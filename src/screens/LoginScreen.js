import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { login, register } from '../services/storageService';

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { email: email.trim(), password };
      if (mode === 'register') {
        await register({ ...payload, name: name.trim() });
      } else {
        await login(payload);
      }

      onAuthSuccess?.();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        'No se pudo autenticar. Intenta de nuevo.';
      setError(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-food-light p-6 justify-center">
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <View className="items-center mb-4">
          <Icon name="chef-hat" size={48} color="#FF8C42" />
          <Text className="text-2xl font-bold text-food-dark mt-2">Maqoo</Text>
          <Text className="text-gray-600 mt-1">
            {mode === 'login'
              ? 'Inicia sesión para sincronizar tus datos'
              : 'Crea tu cuenta para guardar tus recetas'}
          </Text>
        </View>

        {mode === 'register' && (
          <View className="mb-3">
            <Text className="text-food-dark font-semibold mb-2">Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              className="bg-gray-100 rounded-xl px-4 py-3"
              autoCapitalize="words"
            />
          </View>
        )}

        <View className="mb-3">
          <Text className="text-food-dark font-semibold mb-2">Correo</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-100 rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-4">
          <Text className="text-food-dark font-semibold mb-2">Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            className="bg-gray-100 rounded-xl px-4 py-3"
          />
        </View>

        {error ? (
          <View className="bg-red-100 border border-red-200 rounded-xl p-3 mb-3">
            <Text className="text-red-700">{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="bg-food-orange rounded-xl py-3 items-center"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode} className="mt-4 items-center">
          <Text className="text-food-dark">
            {mode === 'login'
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
