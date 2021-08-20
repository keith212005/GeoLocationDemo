import React, {Component} from 'react';

import {extendTheme, NativeBaseProvider} from 'native-base';
import {StackNavigator} from '@navigator';

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};

const theme = extendTheme({colors: newColorTheme});

export default class App extends Component {
  render() {
    return (
      <NativeBaseProvider theme={theme}>
        <StackNavigator />
      </NativeBaseProvider>
    );
  }
}
