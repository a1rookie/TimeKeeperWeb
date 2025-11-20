module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@app': './src/app',
          '@features': './src/features',
          '@shared': './src/shared',
          '@entities': './src/entities',
          '@infrastructure': './src/infrastructure',
        },
      },
    ],
    // Reanimated plugin must be listed last
    'react-native-reanimated/plugin',
  ],
}
