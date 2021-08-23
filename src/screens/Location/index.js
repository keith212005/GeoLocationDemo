import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  DeviceEventEmitter,
  Alert,
} from 'react-native';

import {
  requestMultiple,
  openSettings,
  PERMISSIONS,
} from 'react-native-permissions';
import moment from 'moment';
import axios from 'axios';
import * as geolib from 'geolib';
import RNFS from 'react-native-fs';
import RNLocation from 'react-native-location';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import MapView, {
  PROVIDER_GOOGLE,
  Polyline,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

var dirPath = `${RNFS.ExternalStorageDirectoryPath}/GeoLocationDemo`;
var filePath = dirPath + '/test.txt';

import {styles} from './style';
import {latLongArr, token} from '@constants';
import {callApi} from '@api';

import Config from 'react-native-config';

var locationSubscription: () => void;

export default class Location extends React.PureComponent {
  constructor() {
    super();
    this.writeDataInFile(
      'Constructor: ' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    );

    this.state = {
      location: null,
      user_id: 'Tk5XN0VyM050YzlKb29NVHZSbnA3Zz09',
      meeting_id: '',
      is_start: 2,
      activity_type: 'others',
      sort_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      distance: '10 km',
      out_location: 'Ahmedabad',
      currentLongitude: '',
      currentLatitude: '',
      trackResponse: null,
      distance: null,
      isTracking: false,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  componentDidMount() {
    let subscription = DeviceEventEmitter.addListener(
      'notificationClickHandle',
      function (e) {
        console.log('json', e);
      },
    );

    this.getInitialLocation();
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
      interval: 5000, // Milliseconds
      fastestInterval: 5000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: 'other',
      allowsBackgroundLocationUpdates: true,
      headingFilter: 1, // Degrees
      headingOrientation: 'portrait',
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });

    this.getAllPermissions()
      .then(() => {
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
          RNFS.mkdir(dirPath);
          this.writeDataInFile('Internet connected: ' + state.isConnected);
        });
      })
      .catch(e => {
        Alert.alert(
          'Go To Settings',
          'Please grant Location and Storage Permissions to GeoLocationDemo to track your location in Settings -> Permissions.',
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {
              text: 'Go To Settings',
              onPress: () => openSettings().catch(() => {}),
            },
          ],
        );
      });

    console.log('API URL>>>>>>>>>>>', Config.API_URL);
  }

  getInitialLocation() {
    RNLocation.getLatestLocation({timeout: 60000}).then(latestLocation => {
      console.log('latestLocation>>>>>', latestLocation);
      this.setState({
        region: {
          latitude: latestLocation.latitude,
          longitude: latestLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    });
  }

  oneOfThem(array, value) {
    return array.includes(value);
  }

  getAllPermissions() {
    return new Promise((resolve, reject) => {
      var permissions = [];
      if (Platform.OS == 'ios') {
        permissions = [
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ];
      } else {
        permissions = [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ];
      }

      requestMultiple(permissions)
        .then(statuses => {
          const permissionStatus = [
            statuses[permissions[0]],
            statuses[permissions[1]],
          ];
          const values = ['granted', 'limited'];

          if (
            this.oneOfThem(values, permissionStatus[0]) &&
            this.oneOfThem(values, permissionStatus[1])
          ) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(e => {});
    });
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

  callTestLatLongApi(lat, long) {
    return new Promise((resolve, reject) => {
      const params = {
        url: Config.API_URL,
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
          var response = data[0];
          const {status_code, message} = response;
          Toast.show(JSON.stringify(response), Toast.LONG);
          this.writeDataInFile('response: ' + JSON.stringify(response));
          resolve();
        })
        .catch(e => console.log('api error>>>', e));
    });
  }

  _startTrackingListener() {
    // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
    if (ReactNativeForegroundService.is_task_running(144)) return;

    // Creating a task.
    ReactNativeForegroundService.add_task(
      () => {
        this.writeDataInFile('Start Tracking Listener.', this.state.isTracking);
        if (this.state.isTracking) {
          locationSubscription = RNLocation.subscribeToLocationUpdates(
            ([locations]) => {
              const {latitude, longitude} = locations;
              var params = 'Latitude: ' + latitude + ' Longitude: ' + longitude;
              this.writeDataInFile(params);
              this.callTestLatLongApi(latitude, longitude);
            },
          );
        }
      },
      {
        delay: 100,
        onLoop: false,
        taskId: 144, // this must be same
        onError: e => console.log(`Error logging:`, e),
      },
    );
    // starting  foreground service.
    return ReactNativeForegroundService.start({
      id: 144,
      title: 'Foreground Service',
      message: 'you are online!',
    });
  }

  onStop = () => {
    this.writeDataInFile('Tracking stopped.');
    locationSubscription && locationSubscription();
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running(144)) {
      ReactNativeForegroundService.remove_task(144);
    }
    // Stoping Foreground service.
    return ReactNativeForegroundService.stop();
  };

  _startUpdatingLocation = () => {
    this.getAllPermissions()
      .then(() => {
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
          RNFS.mkdir(dirPath);
          this.writeDataInFile('Internet connected: ' + state.isConnected);
          this.setState({isTracking: true}, () => {
            this._startTrackingListener();
          });
        });
      })
      .catch(e => {
        Alert.alert(
          'Go To Settings',
          'Please grant Location and Storage Permissions to GeoLocationDemo to track your location in Settings -> Permissions.',
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {
              text: 'Go To Settings',
              onPress: () => openSettings().catch(() => {}),
            },
          ],
        );
      });
  };

  _stopUpdatingLocation = () => {
    this.setState({isTracking: false}, () => this.onStop());
  };

  writeDataInFile(params) {
    RNFS.appendFile(filePath, params + '\n', 'utf8')
      .then(success => {})
      .catch(err => console.log(err.message));
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({region});
  }

  render() {
    const {location, trackResponse} = this.state;
    return (
      <>
        <ScrollView style={styles.container}>
          <SafeAreaView style={styles.innerContainer}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <View style={styles.row}>
                {this.state.trackResponse != null && (
                  <Text style={styles.json}>
                    {JSON.stringify(trackResponse)}
                  </Text>
                )}
              </View>

              <TextInput
                placeholderTextColor="black"
                placeholder="Enter Meeting Id"
                value={this.state.meeting_id}
                onChangeText={value => this.setState({meeting_id: value})}
                style={styles.inputStyle}
              />
              <Text style={styles.title}>react-native-location</Text>
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
          </SafeAreaView>
        </ScrollView>
        <MapView
          showsUserLocation={true}
          followUserLocation={true}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          loadingEnabled
          region={this.state.region}
          onRegionChangeComplete={region => {
            this.onRegionChange(region);
          }}></MapView>
      </>
    );
  }
}
