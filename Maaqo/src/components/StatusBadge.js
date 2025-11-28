import React from 'react';
import { View, Text } from 'react-native';

const StatusBadge = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'cocinable':
        return {
          text: 'Listo para cocinar',
          bgColor: '#2A9D8F',
          textColor: '#FFFFFF',
        };
      case 'casi_cocinable':
        return {
          text: 'Casi listo',
          bgColor: '#FF8C42',
          textColor: '#FFFFFF',
        };
      default:
        return {
          text: 'Sugerida',
          bgColor: '#9CA3AF',
          textColor: '#FFFFFF',
        };
    }
  };

  const config = getConfig();

  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: config.bgColor }}
    >
      <Text className="text-xs font-semibold" style={{ color: config.textColor }}>
        {config.text}
      </Text>
    </View>
  );
};

export default StatusBadge;

