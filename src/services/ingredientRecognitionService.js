import { API_BASE_URL } from '../utils/apiClient';
import { getToken } from './storageService';

export const recognizeIngredients = async (imageUri) => {
  if (!imageUri) {
    throw new Error('No image provided for recognition');
  }

  const token = await getToken();

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'ingredient.jpg',
    type: 'image/jpeg',
  });

  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ingredients/recognize`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo analizar la imagen');
  }

  return response.json();
};
