module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
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
  ],
}
