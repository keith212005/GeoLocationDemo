import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {NativeBaseProvider, Box} from 'native-base';

import {styles} from './style';

export default class MapScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NativeBaseProvider>
          <Box>Hello world</Box>
        </NativeBaseProvider>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}></MapView>
      </View>
    );
  }
}
