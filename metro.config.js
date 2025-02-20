const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
