import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { login, register } from '../services/storageService';

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollViewRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
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

  const handleInputFocus = (inputRef) => {
    // Scroll simple cuando el teclado aparece, sin usar measureLayout
    setTimeout(() => {
      if (scrollViewRef.current) {
        // Scroll mínimo para que el campo sea visible
        scrollViewRef.current.scrollTo({ y: 60, animated: true });
      }
    }, 300);
  };

  return (
    <View style={{ flex: 1 }} className="bg-food-light">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
           <View
             style={{ flex: 1 }}
             className={`px-6 pb-6 ${keyboardVisible ? 'justify-end' : 'justify-center'}`}
           >
            <View className="bg-white rounded-2xl p-6 shadow-sm">

               {/* ICONO Y TITULO */}
               <View className="items-center mb-4">
                 <Icon name="chef-hat" size={48} color="#FF8C42" />
                 <Text className="text-2xl font-bold text-food-dark mt-2">Maqoo</Text>
                 <Text className="text-gray-600 mt-1">
                   {mode === 'login'
                     ? 'Inicia sesión para sincronizar tus datos'
                     : 'Crea tu cuenta para guardar tus recetas'}
                 </Text>
               </View>

              {/* NOMBRE */}
              {mode === 'register' && (
                <View className="mb-3">
                  <Text className="text-food-dark font-semibold mb-2">Nombre</Text>
                  <TextInput
                    ref={nameInputRef}
                    value={name}
                    onChangeText={setName}
                    placeholder="Tu nombre"
                    className="bg-gray-100 rounded-xl px-4 py-3"
                    autoCapitalize="words"
                    onFocus={() => handleInputFocus(nameInputRef)}
                  />
                </View>
              )}

              {/* CORREO */}
              <View className="mb-3">
                <Text className="text-food-dark font-semibold mb-2">Correo</Text>
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-gray-100 rounded-xl px-4 py-3"
                  onFocus={() => handleInputFocus(emailInputRef)}
                />
              </View>

              {/* CONTRASEÑA */}
              <View className="mb-4">
                <Text className="text-food-dark font-semibold mb-2">Contraseña</Text>
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry
                  className="bg-gray-100 rounded-xl px-4 py-3"
                  onFocus={() => handleInputFocus(passwordInputRef)}
                />
                {password.length > 0 && password.length < 6 && (
                  <Text className="text-xs text-orange-600 mt-1">
                    Faltan {6 - password.length}{' '}
                    {6 - password.length === 1 ? 'carácter' : 'caracteres'}
                  </Text>
                )}
              </View>

              {/* ERROR */}
              {error ? (
                <View className="bg-red-100 border border-red-200 rounded-xl p-3 mb-3">
                  <Text className="text-red-700">{error}</Text>
                </View>
              ) : null}

              {/* SUBMIT */}
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

              {/* CAMBIO DE MODO */}
              <TouchableOpacity onPress={toggleMode} className="mt-4 items-center">
                <Text className="text-food-dark">
                  {mode === 'login'
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
