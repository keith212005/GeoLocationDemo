import React from 'react';
import {StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import * as Screen from '@screens';

const Stack = createStackNavigator();

export default class StackNavigator extends React.Component {
  _addScreen = (routeName, isNavigator = false, extraProps = {}) => (
    <Stack.Screen
      name={routeName}
      component={!isNavigator ? Screen[routeName] : undefined}
      {...extraProps}
    />
  );

  render() {
    return (
      <>
        <StatusBar
          backgroundColor="transparent"
          barStyle={'dark-content'}
          translucent={false}
        />

        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gesturesEnabled: false,
              animationEnabled: false,
            }}>
            {this._addScreen('MapScreen')}

            {this._addScreen('Location')}
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
