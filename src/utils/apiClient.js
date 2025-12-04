const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const PLACES_BASE_URL = process.env.EXPO_PUBLIC_PLACES_BASE_URL || API_BASE_URL;

export const buildUrl = (path, params = {}, baseUrl = API_BASE_URL) => {
  const url = new URL(path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

export const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export { API_BASE_URL };
export { PLACES_BASE_URL };
