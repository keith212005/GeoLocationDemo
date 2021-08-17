import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

import RNLocation from 'react-native-location';
import moment from 'moment';
import axios from 'axios';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import * as geolib from 'geolib';

import {styles} from './style';
import {token, url, latLongArr} from '@constants';
import {callApi} from '@api';

const repoUrl = 'https://github.com/timfpark/react-native-location';

let locationSubscription = null;
let locationTimeout = null;

export default class Location extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: null,
      user_id: 'Tk5XN0VyM050YzlKb29NVHZSbnA3Zz09',
      meeting_id: 'S2R5V1c4S0xUaTNBbElmMFVCZ0t6Zz09',
      is_start: 2,
      activity_type: 'others',
      sort_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      distance: '10 km',
      out_location: 'Ahmedabad',
      currentLongitude: '',
      currentLatitude: '',
      trackResponse: null,
      distance: null,
    };
  }

  componentDidMount() {
    this.calculateDistanceFromArray()
      .then(dist => console.log('distance: ', dist.toFixed(2) + ' Kms'))
      .catch(e => console.log(e));

    RNLocation.configure({
      distanceFilter: 5, // Meters
      desiredAccuracy: {
        ios: 'best',
        android: 'highAccuracy',
      },
      // Android only
      androidProvider: 'auto',
      interval: 10000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 10000, // Milliseconds
      // iOS Only
      activityType: 'other',
      allowsBackgroundLocationUpdates: true,
      headingFilter: 1, // Degrees
      headingOrientation: 'portrait',
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });

    this.requestLocationPermission()
      .then(() => {})
      .catch(() => {});
  }

  calculateDistanceFromArray() {
    return new Promise((resolve, reject) => {
      var total_distance = 0;
      for (var i = 0; i < latLongArr.length - 1; i++) {
        var distance = geolib.getPreciseDistance(
          {latitude: latLongArr[i].lat, longitude: latLongArr[i].long},
          {latitude: latLongArr[i + 1].lat, longitude: latLongArr[i + 1].long},
        );
        total_distance = total_distance + distance / 1000;
      }
      resolve(total_distance);
    });
  }

  requestLocationPermission() {
    return new Promise((resolve, reject) => {
      RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'fine',
          rationale: {
            title: 'Location permission',
            message: 'We use your location to demo the library',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      }).then(granted => {
        if (granted) {
          resolve();
        }
      });
    });
  }

  callTestLatLongApi(lat, long) {
    return new Promise((resolve, reject) => {
      console.log('NEW Location 2: ', '' + lat, '' + long);

      const params = {
        url: url,
        token: token,
        type: 'application/json',
        data: {
          user_id: this.state.user_id,
          meeting_id: this.state.meeting_id,
          latitude: lat,
          longitude: long,
          is_start: this.state.is_start,
          activity_type: this.state.activity_type,
          sort_datetime: this.state.sort_datetime,
          distance: this.state.distance,
          out_location: this.state.out_location,
        },
      };

      callApi([params])
        .then(data => {
          console.log('response>>>>>', data);
          this.setState({trackResponse: data}, () => resolve());
        })
        .catch(e => console.log('api error>>>', e));
    });
  }

  _startUpdatingLocation = () => {
    this.requestLocationPermission()
      .then(() => {
        console.log('start updating location.......');

        ReactNativeForegroundService.start({
          id: 144,
          title: 'Location Started',
          message: 'you are on the way!',
        });

        locationSubscription = RNLocation.subscribeToLocationUpdates(
          ([locations]) => {
            var response = locations;
            response.speed = response.speed * 3.6;
            this.setState({location: response});
            console.log('Location response>>>>', response);

            this.callTestLatLongApi(locations.latitude, locations.longitude);
          },
        );
      })
      .catch(() => console.log('Permission denied!'));
  };

  _stopUpdatingLocation = () => {
    console.log('stopping location service...');
    locationSubscription && locationSubscription();

    ReactNativeForegroundService.stop();

    RNLocation.getLatestLocation({timeout: 60000}).then(latestLocation => {
      // Use the location here
      console.log('latestLcoation>>>>>', latestLocation);
      this.callTestLatLongApi(
        latestLocation.latitude,
        latestLocation.longitude,
      ).then(() => {
        this.setState({location: null, trackResponse: null});
      });
    });
  };

  _openRepoUrl = () => {
    Linking.openURL(repoUrl).catch(err =>
      console.error('An error occurred', err),
    );
  };

  render() {
    const {location, trackResponse} = this.state;
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <View style={styles.row}>
              {this.state.trackResponse != null && (
                <Text style={styles.json}>{JSON.stringify(trackResponse)}</Text>
              )}
            </View>

            <TextInput
              placeholder="Enter Meeting Id"
              value={this.state.meeting_id}
              onChangeText={value => this.setState({meeting_id: value})}
              style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                width: 300,
              }}
            />
            <Text style={styles.title}>react-native-location</Text>
            <TouchableHighlight
              onPress={this._openRepoUrl}
              underlayColor="#CCC"
              activeOpacity={0.8}>
              <Text style={styles.repoLink}>{repoUrl}</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.row}>
            <TouchableHighlight
              onPress={this._startUpdatingLocation}
              style={[styles.button, {backgroundColor: '#126312'}]}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this._stopUpdatingLocation}
              style={[styles.button, {backgroundColor: '#881717'}]}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableHighlight>
          </View>

          {location && (
            <React.Fragment>
              <View style={styles.row}>
                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Course</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.course}
                  </Text>
                </View>

                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Speed</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.speed}
                  </Text>
                </View>

                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Altitude</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.altitude}
                  </Text>
                </View>
              </View>

              <View style={{alignItems: 'flex-start'}}>
                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Latitude</Text>
                    <Text style={styles.detail}>{location.latitude}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Longitude</Text>
                    <Text style={styles.detail}>{location.longitude}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Accuracy</Text>
                    <Text style={styles.detail}>{location.accuracy}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Altitude Accuracy</Text>
                    <Text style={styles.detail}>
                      {location.altitudeAccuracy}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Timestamp</Text>
                    <Text style={styles.detail}>{location.timestamp}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Date / Time</Text>
                    <Text style={styles.detail}>
                      {moment(location.timestamp).format('MM-DD-YYYY h:mm:ss')}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.full]}>
                    <Text style={styles.json}>{JSON.stringify(location)}</Text>
                    <Text style={styles.json}>
                      {JSON.stringify(trackResponse)}
                    </Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          )}
        </SafeAreaView>
      </ScrollView>
    );
  }
}
