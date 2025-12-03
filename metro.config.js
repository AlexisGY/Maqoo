// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

// NativeWind v4 configuration
try {
  const { withNativeWind } = require('nativewind/metro');
  config = withNativeWind(config, { input: './global.css' });
} catch (error) {
  console.warn('NativeWind metro config could not be loaded:', error.message);
}

module.exports = config;

