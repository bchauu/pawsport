module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['babel-plugin-transform-define', {
        'process.env.apiUrl': process.env.NODE_ENV === 'production' ? 'https://api.yourdomain.com' : 'http://10.184.187.164:3000',
      }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }]
    ]
  };
};