/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-mmkv', () => {
  const storage = new Map();

  return {
    createMMKV: () => ({
      getString: key => storage.get(key) ?? undefined,
      set: (key, value) => storage.set(key, value),
      remove: key => storage.delete(key),
    }),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => undefined;
  return Reanimated;
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');

  const MapView = props => React.createElement(View, props);
  const Marker = props => React.createElement(View, props);

  return {
    __esModule: true,
    default: MapView,
    Marker,
    PROVIDER_GOOGLE: 'google',
  };
});
