// import React from "react";
// import { connect } from "react-redux";
// import Images from "../constants/images";
// import color from "../constants/color";
// import {
//   View,
//   StyleSheet,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   FlatList,
//   ImageBackground,
//   TouchableOpacity,
//   Button,
//   Alert,
//   Slider,
//   RefreshControl,
//   Platform,
//   Linking,
//   PermissionsAndroid,
//   ToastAndroid,
// } from "react-native";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import Font from "../constants/font";
// import { strings } from "../constants/strings";
// import font from "../constants/font";
// import images from "../constants/images";
// import { margins } from "../constants/margins";
// import { dimens } from "../constants/dimens";
// import { isValidEmailAddress, isEmpty } from "../constants/validator";
// import { pref_setIsAddToCartItem, clearLogin } from "../utils/session";
//
// import styles from "../styles/home";
// import commonStyles from "../styles/commonStyles";
// import { hw } from "../constants/hw";
// import MyStatusBar from "../components/statusbar";
// import AppLogoBlack from "../components/appLogoBlack";
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
// } from "react-native-responsive-dimensions";
// import {
//   getDriverOrderlist,
//   logoutSmartApp,
//   updateDriverPickup,
//   getLatLongDeliveryAgent,
// } from "../redux/actions";
// import Loader from "../components/Dialog";
// import { paddings } from "../constants/paddings";
// import session from "../utils/session";
// import AsyncStorage from "@react-native-community/async-storage";
// import {
//   pref_setCartItems,
//   pref_getCartItems,
//   clearCart,
//   pref_setTracking,
//   pref_getTracking,
//   pref_getLogin,
//   pref_getBattery,
//   pref_setBattery,
// } from "../utils/session";
// import BackgroundTimer from "react-native-background-timer";
//
// import TwoButtonAlertDialog from "../components/TwoButtonAlertDialog";
// import { EventRegister } from "react-native-event-listeners";
// import { globalEventListener } from "../constants/globalEventListener";
// import SingleButtonAlertDialog from "../components/SingleButtonAlertDialog";
// import { getAppMsg } from "../utils/session";
// import BCotHeaderDashboard from "../components/BCotHeaderDashboard";
// import RNAndroidSettingsTool from "react-native-android-settings-tool";
// import * as util from "../utils/Utility";
// import TextDisplayDianlog from "../components/TextDisplayDianlog";
// import SplashScreen from "react-native-splash-screen";
// import { fontsizes } from "../constants/theme";
// import apiPath from "../constants/apiPath";
// import { NavigationActions, StackActions } from "react-navigation";
//
// import { NavigationContainer } from "@react-navigation/native";
// import baseConstants from "../constants/baseConstants";
// import moment from "moment";
// import Geolocation from "@react-native-community/geolocation";
//
// import signalr from "react-native-signalr";
//
// import ReactNativeForegroundService from "@supersami/rn-foreground-service";
// import RNLocation from "react-native-location";
// import { io } from "socket.io-client";
// RNLocation.configure({
//   distanceFilter: 10, // Meters
//   desiredAccuracy: {
//     ios: "best",
//     android: "balancedPowerAccuracy",
//   },
//   // Android only
//   androidProvider: "auto",
//   interval: 5000, // Milliseconds
//   fastestInterval: 5000, // Milliseconds
//   maxWaitTime: 5000, // Milliseconds
//   // iOS Only
//   activityType: "other",
//   allowsBackgroundLocationUpdates: false,
//   headingFilter: 1, // Degrees
//   headingOrientation: "portrait",
//   pausesLocationUpdatesAutomatically: false,
//   showsBackgroundLocationIndicator: false,
// });
// let locationSubscription = null;
// let locationTimeout = null;
//
// let headerName = "";
// let subHeadeName = "";
// let locationId = 0;
// let stampCount = 5;
// let userInfo = "";
// let updateStatus = -1;
// let selectedOrderID = "";
// let intervalId = 0;
// let cartData = null;
// tempOrderType = 0;
// let dialogtype = "logout";
// let selectedOrderstatus = baseConstants.PENDING_ORDER_STATUS;
// let cLatitude = 0;
// let cLongitude = 0;
// let Interval = 5000;
// class Home extends React.Component {
//   constructor(props) {
//     super(props);
//
//     headerName = this.props.navigation.getParam("headerName", "");
//     subHeadeName = this.props.navigation.getParam("headerName", "");
//     locationId = this.props.navigation.getParam("headerName", "");
//
//     this.state = {
//       isloading: false,
//       orderlist: [],
//       selctedOrderType: 2,
//       isDilogVisible: false,
//       isNotificationDialog: false,
//       isNormalDilogVisible: false,
//       isBatteryDialog: false,
//       alertMessage: "",
//       currentLongitude: "",
//       currentLatitude: "",
//       locationStatus: "",
//     };
//     this.getAppMsgs();
//     //setInterval(this._getLocationAsync.bind(this), 5000);
//
//     // pref_getTracking((response) => {
//     //   if (response == "2") {
//     //     // BackgroundTimer.clearInterval(intervalId);
//     //   } else if (response == "1") {
//     //     this.startServiceFun();
//     //     // intervalId = BackgroundTimer.setInterval(() => {
//     //     //   this._getLocationAsync.bind(this);
//     //     //   this.requestLocationPermission();
//     //     //   console.log("BackgroundTimer : After App open");
//     //     // }, Interval);
//     //   }
//     // });
//     if (Platform.OS == "android") {
//       pref_getBattery((response) => {
//         if (response != "2") {
//           this.setState({
//             isBatteryDialog: true,
//             alertMessage:
//               "Lets app always run in background? Battery saver > No Restriction.",
//           });
//         }
//       });
//     }
//   }
//
//   getAppMsgs() {
//     // call this method in constuctor
//     getAppMsg((msges) => {
//       this.setState({
//         appMsg: msges,
//       });
//     });
//   }
//
//   fetchAppMsg = (key) => {
//     // use this method to fetch msg
//     return this.state.appMsg[key];
//   };
//   startServiceFun = () => {
//     ReactNativeForegroundService.start({
//       id: 144,
//       title: "Location Started",
//       message: "you are on the way!",
//     });
//
//     ReactNativeForegroundService.add_task(
//       () => {
//         RNLocation.requestPermission({
//           ios: "whenInUse",
//           android: {
//             detail: "fine",
//             rationale: {
//               title: "We need to access your location",
//               message:
//                 "We use your location while your run to calculate your distance and pace",
//               buttonPositive: "OK",
//               buttonNegative: "Cancel",
//             },
//           },
//         })
//           .then((granted) => {
//             console.log("Location Permissions: ", granted);
//             // if has permissions try to obtain location with RN location
//             if (granted) {
//               locationSubscription && locationSubscription();
//               locationSubscription = RNLocation.subscribeToLocationUpdates(
//                 ([locations]) => {
//                   locationSubscription();
//                   locationTimeout && clearTimeout(locationTimeout);
//                   // console.log("NEW Location : ", locations);
//                   console.log(
//                     "NEW Location 2: ",
//                     "" + locations.latitude,
//                     "" + locations.longitude
//                   );
//                   this.APIcallLocation(
//                     "" + locations.latitude,
//                     "" + locations.longitude
//                   );
//                 }
//               );
//             } else {
//               locationSubscription && locationSubscription();
//               locationTimeout && clearTimeout(locationTimeout);
//               console.log("no permissions to obtain location");
//             }
//           })
//           .catch((e) => {
//             console.log("eee>>>>", e);
//           });
//       },
//       {
//         delay: 1000,
//         onLoop: true,
//         taskId: "taskid",
//         onError: (e) => console.log("Error logging:", e),
//       }
//     );
//   };
//   getNotificationPrefData = () => {
//     AsyncStorage.getItem(session.pref_notification_data, (err, value) => {
//       if (err) {
//       } else {
//         let notificationData = JSON.parse(value);
//         if (notificationData != "") {
//           EventRegister.emit(
//             globalEventListener.scanBarcodeNotification,
//             notificationData
//           );
//         }
//         //console.log("notificationData")
//         //console.log(JSON.stringify(notificationData))
//       }
//     });
//   };
//
//   componentWillMount() {
//     this.listener = EventRegister.addEventListener(
//       globalEventListener.customerDetails,
//       () => {
//         this.getLoginInfo();
//       }
//     );
//     this.listener = EventRegister.addEventListener(
//       globalEventListener.addToCartCount,
//       (data) => {
//         console.log("addEventListener called for add to cart");
//       }
//     );
//     this.listener = EventRegister.addEventListener(
//       globalEventListener.refreshomeScreen,
//       (data) => {
//         console.log("refreshomeScreen");
//         this.getOrderTask(selectedOrderstatus);
//       }
//     );
//   }
//   componentWillUnmount() {
//     EventRegister.removeEventListener(this.listener);
//   }
//   getOneTimeLocation = () => {
//     this.setState({
//       locationStatus: "Getting Location ...",
//     });
//     console.log("getOneTimeLocation  == Getting Location ...");
//     Geolocation.getCurrentPosition(
//       //Will give you the current location
//       (position) => {
//         this.setState({
//           locationStatus: "You are Here",
//         });
//         console.log("getOneTimeLocation  == You are Here", position);
//         //getting the Longitude from the location json
//         const currentLongitude = JSON.stringify(position.coords.longitude);
//         //getting the Latitude from the location json
//         const currentLatitude = JSON.stringify(position.coords.latitude);
//         cLatitude = currentLatitude;
//         cLongitude = currentLongitude;
//         this.setState({
//           currentLatitude: currentLatitude,
//           currentLongitude: currentLongitude,
//         });
//         console.log("currentLatitude  == ", currentLatitude);
//         console.log("currentLongitude  == ", currentLongitude);
//       },
//       (error) => {
//         this.setState({
//           locationStatus: error.message,
//         });
//         console.log("getOneTimeLocation  App== ", error.message);
//       },
//       {
//         timeout: 30000,
//       }
//     );
//   };
//
//   subscribeLocationLocation = () => {
//     Geolocation.watchPosition(
//       (position) => {
//         //Will give you the location on location change
//         this.setState({
//           locationStatus: "You are Here",
//         });
//         console.log("position : ", position);
//         //getting the Longitude from the location json
//         const currentLongitude = JSON.stringify(position.coords.longitude);
//         //getting the Latitude from the location json
//         const currentLatitude = JSON.stringify(position.coords.latitude);
//         cLatitude = currentLatitude;
//         cLongitude = currentLongitude;
//         this.setState({
//           currentLatitude: currentLatitude,
//           currentLongitude: currentLongitude,
//         });
//         console.log("currentLatitude Sub == ", currentLatitude);
//         console.log("currentLongitude Sub == ", currentLongitude);
//         this.VerifyNPostLocation();
//       },
//       (error) => {
//         this.setState({
//           locationStatus: error.message,
//         });
//       },
//       {
//         timeout: 30000,
//         interval: 5000,
//         distanceFilter: 1,
//         showsBackgroundLocationIndicator: true,
//       }
//     );
//   };
//   APIcallLocation(lat, lng) {
//     //  ToastAndroid.show("Location : " + lat + " , " + lng, ToastAndroid.SHORT);
//     console.log("getLatLongDeliveryAgent - 1" + lat, " " + lng);
//     this.props
//       .dispatch(
//         getLatLongDeliveryAgent(
//           userInfo.userDetail[0].userId,
//           "" + lat,
//           "" + lng
//         )
//       )
//       .then(() => {
//         console.log("getLatLongDeliveryAgent - 1");
//         console.log(this.props.data);
//         console.log(
//           baseConstants.PENDING_ORDER_STATUS +
//             " getLatLongDeliveryAgent ===--- ",
//           this.props.data,
//           this.props.data.data.status
//         );
//       });
//   }
//   VerifyNPostLocation() {
//     pref_getLogin((response) => {
//       if (response == null) {
//       } else {
//         console.log("Set Interval : pref_getLogin");
//         pref_getTracking((response) => {
//           if (response == "1") {
//             console.log("Set Interval : response ", response);
//             Geolocation.getCurrentPosition(
//               (position) => {
//                 console.log("position : ", position);
//                 this.APIcallLocation(
//                   "" + position.coords.latitude,
//                   "" + position.coords.longitude
//                 );
//               },
//               (error) => {
//                 console.log("Set Interval : error ", error.message);
//               },
//               {
//                 timeout: 30000,
//                 interval: 5000,
//                 distanceFilter: 1,
//                 showsBackgroundLocationIndicator: true,
//               }
//             );
//           }
//         });
//       }
//     });
//   }
//   getLoginInfo = () => {
//     pref_getLogin((response) => {
//       if (response == null) {
//       } else {
//         userInfo = JSON.parse(response);
//         console.log("userInfo : " + JSON.stringify(userInfo));
//         this.setState({
//           orderlist: [],
//         });
//         this.getOrderTask(selectedOrderstatus);
//       }
//     });
//   };
//
//   componentDidMount() {
//     //  SplashScreen.hide();
//
//     AsyncStorage.getItem(session.pref_delivery_address).then((response) => {
//       if (response != null) {
//         let obj = JSON.parse(response).filter((add) => add.isselect == true);
//         console.log("------------- ", obj);
//         this.setState({ objDelivery: obj });
//       } else {
//       }
//     });
//     this.signalRFunction();
//     this.getNotificationPrefData();
//     this.getLoginInfo();
//     this.notificationlistener();
//     // this.getmenucategorieslistTask();
//     // this.getcurrentLocation()
//     console.log("------------- ", "Entern to permission");
//     //this.requestLocationPermission();
//     return () => {
//       //Geolocation.clearWatch(watchID);
//     };
//   }
//
//   signalRFunction() {
//     console.log("signalRFunction");
//     const connection = signalr.hubConnection("http://lypizza.on-linedemo.com");
//
//     connection.logging = true;
//     const proxy = connection.createHubProxy("chatHub");
//     //receives broadcast messages from a hub function, called "helloApp"
//     proxy.on("helloApp", (argOne, argTwo, argThree, argFour) => {
//       console.log("message-from-server", argOne, argTwo, argThree, argFour);
//       //Here I could response by calling something else on the server...
//     });
//
//     // atempt connection, and handle errors
//     connection
//       .start()
//       .done(() => {
//         console.log("Now connected, connection ID=" + connection.id);
//
//         proxy
//           .invoke("helloServer", "Hello Server, how are you?")
//           .done((directResponse) => {
//             console.log("direct-response-from-server", directResponse);
//           })
//           .fail(() => {
//             console.warn(
//               "Something went wrong when calling server, it might not be up and running?"
//             );
//           });
//       })
//       .fail((MSG) => {
//         console.log("Failed", MSG);
//       });
//
//     //connection-handling
//     connection.connectionSlow(() => {
//       console.log(
//         "We are currently experiencing difficulties with the connection."
//       );
//     });
//
//     connection.error((error) => {
//       const errorMessage = error.message;
//       let detailedError = "";
//       if (error.source && error.source._response) {
//         detailedError = error.source._response;
//       }
//       if (
//         detailedError ===
//         "An SSL error has occurred and a secure connection to the server cannot be made."
//       ) {
//         console.log(
//           "When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14"
//         );
//       }
//       console.debug("SignalR error: " + errorMessage, detailedError);
//     });
//   }
//   // requestLocationPermission = async () => {
//   //   if (Platform.OS === "ios") {
//   //     console.log("------------- ", "ios permissioin");
//   //     this.getOneTimeLocation();
//   //     this.subscribeLocationLocation();
//   //   } else if (Platform.OS === "android") {
//   //     console.log("------------- ", "Android permissioin");
//   //     try {
//   //       const granted = await PermissionsAndroid.request(
//   //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//   //         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//   //         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//   //         {
//   //           title: "Location Access Required",
//   //           message: "This App needs to Access your location",
//   //         }
//   //       );
//   //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//   //         //To Check, If Permission is granted
//   //         console.log("------------- ", "Android permissioin granted");
//   //         //  this.getOneTimeLocation();
//   //         this.subscribeLocationLocation();
//   //       } else {
//   //         this.setState({
//   //           locationStatus: "Permission Denied",
//   //         });
//   //       }
//   //     } catch (err) {
//   //       console.warn("------------- ", err);
//   //     }
//   //   }
//   // };
//   getOrderTask = (ordertype) => {
//     this.setState({
//       isloading: true,
//     });
//     this.props
//       .dispatch(getDriverOrderlist(userInfo.userDetail[0].userId, ordertype))
//       .then(() => {
//         this.setState({
//           isloading: false,
//         });
//         console.log("getOrderTask - 1 : ", ordertype);
//         console.log(this.props.data);
//         console.log(
//           baseConstants.PENDING_ORDER_STATUS + " orderlist ===--- ",
//           this.props.data,
//           this.props.data.data.status
//         );
//         if (this.props.data.error) {
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data,
//           });
//         } else if (this.props.data.data.status == 1) {
//           console.log(
//             " orderlist ===--- ",
//             this.props.data.data.result.orderList
//           );
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data.result,
//           });
//         } else {
//           this.setState(
//             {
//               isDialogVisible: true,
//               orderlist: this.props.data.data.result.orderList,
//             },
//             () => {
//               if (ordertype == 2) {
//                 if (this.state.orderlist.length > 0) {
//                   console.log(
//                     "Check Status : For loop",
//                     JSON.stringify(this.state.orderlist)
//                   );
//                   let isNeedTrack = false;
//                   for (let i = 0; i < this.state.orderlist.length; i++) {
//                     console.log(
//                       "Check Status : ",
//                       this.state.orderlist[i].pickupDriver
//                     );
//                     if (this.state.orderlist[i].pickupDriver == 1) {
//                       isNeedTrack = true;
//                       break;
//                     } else {
//                       isNeedTrack = false;
//                     }
//                   }
//                   setTimeout(() => {
//                     console.log("Check Status : isNeedTrack ", isNeedTrack);
//                     if (isNeedTrack) {
//                       this.startServiceFun();
//                     } else {
//                       ReactNativeForegroundService.stop();
//                       // await  ReactNativeForegroundService.stopService()
//                     }
//                   }, 1000);
//                 } else {
//                   console.log("Check Status : Empty");
//                 }
//               } else {
//                 console.log("Check Status : no need");
//               }
//             }
//           );
//         }
//       });
//   };
//
//   updateDriverPickup = (lat, lng) => {
//     this.setState({
//       isloading: true,
//     });
//     console.log("currentLatitude - 1 : ", lat);
//     console.log("currentLongitude - 1 : ", lng);
//     this.props
//       .dispatch(
//         updateDriverPickup(
//           userInfo.userDetail[0].userId,
//           selectedOrderID,
//           updateStatus,
//           "" + lat,
//           "" + lng
//         )
//       )
//       .then(() => {
//         this.setState({
//           isloading: false,
//         });
//         console.log("updateDriverPickup - 1");
//         console.log(this.props.data);
//         console.log(
//           baseConstants.PENDING_ORDER_STATUS + " updateDriverPickup ===--- ",
//           this.props.data,
//           this.props.data.data.status
//         );
//         if (this.props.data.error) {
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data,
//           });
//         } else if (this.props.data.data.status == 1) {
//           console.log(
//             " orderlist ===--- ",
//             this.props.data.data.result.orderList
//           );
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data.result,
//           });
//         } else {
//           console.log("getOrderTask - 1 after start : ", selectedOrderstatus);
//           this.getOrderTask(selectedOrderstatus);
//           pref_setTracking("" + updateStatus);
//           if (Platform.OS == "android" || Platform.OS == "ios") {
//             // // this._getLocationAsync.bind(this);
//             // BackgroundTimer.setInterval(() => {
//             //   this._getLocationAsync.bind(this);
//             //   this.requestLocationPermission();
//             //   console.log("BackgroundTimer : After API");
//             // }, Interval);
//             // this.startServiceFun();
//           } else {
//             console.log(
//               "-------------New ",
//               "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
//             );
//           }
//         }
//       });
//   };
//   _getLocationAsync = async () => {
//     console.log("Set Interval : 1000 * 20");
//     this.VerifyNPostLocation();
//   };
//
//   notificationlistener = () => {
//     this.listener = EventRegister.addEventListener(
//       globalEventListener.scanBarcodeNotification,
//       (data) => {
//         console.log("scanBarcodeNotification");
//         console.log(data);
//
//         if (data != null) {
//           console.log("scanBarcodeNotification inner");
//
//           AsyncStorage.setItem(
//             session.pref_notification_data,
//             JSON.stringify("")
//           ).then(() => {});
//
//           let message = util.getNotificationMessage(data);
//
//           setTimeout(() => {
//             this.setState({
//               isNotificationDialog: true,
//               alertMessage: message,
//             });
//           }, 1000);
//         }
//       }
//     );
//   };
//
//   renderOrderTypeSelction = () => {
//     return (
//       <View
//         style={{
//           borderRadius: 10,
//           marginHorizontal: 20,
//           borderWidth: 0.3,
//           borderColor: color.hintColor,
//           flexDirection: "row",
//           padding: 1,
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             if (
//               this.state.selctedOrderType != baseConstants.PENDING_ORDER_STATUS
//             ) {
//               this.setState({
//                 selctedOrderType: baseConstants.PENDING_ORDER_STATUS,
//                 orderlist: [],
//               });
//               selectedOrderstatus = baseConstants.PENDING_ORDER_STATUS;
//               this.getOrderTask(selectedOrderstatus);
//             }
//           }}
//           style={{
//             borderRadius: 10,
//             paddingVertical: 10,
//             flex: 1,
//             backgroundColor:
//               this.state.selctedOrderType == 2 ? color.ly_red : color.white,
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color:
//                 this.state.selctedOrderType == 2 ? color.white : color.ly_blue,
//               fontSize: 16,
//             }}
//           >
//             PENDING
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             console.log(cartData);
//             if (
//               this.state.selctedOrderType !=
//               baseConstants.COMPLETED_ORDER_STATUS
//             ) {
//               this.setState({
//                 selctedOrderType: baseConstants.COMPLETED_ORDER_STATUS,
//                 orderlist: [],
//               });
//               selectedOrderstatus = baseConstants.COMPLETED_ORDER_STATUS;
//               this.getOrderTask(selectedOrderstatus);
//             }
//           }}
//           style={{
//             borderRadius: 10,
//             flex: 1,
//             backgroundColor:
//               this.state.selctedOrderType == 1 ? color.ly_red : color.white,
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color:
//                 this.state.selctedOrderType == 1 ? color.white : color.ly_blue,
//               fontSize: 16,
//             }}
//           >
//             COMPLETED
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };
//
//   renderDisplayOrderlist = () => {
//     return (
//       <FlatList
//         numColumns={1}
//         refreshControl={
//           <RefreshControl
//             refreshing={false}
//             onRefresh={() => {
//               this.getOrderTask(selectedOrderstatus);
//             }}
//           />
//         }
//         data={this.state.orderlist}
//         renderItem={({ item, index }) => (
//           <View style={{}}>
//             <TouchableOpacity
//               style={{ paddingHorizontal: 20, paddingVertical: 12 }}
//               onPress={() => {
//                 this.props.navigation.navigate("OrderDetailsDriver", {
//                   orderId: item.orderId,
//                   orderNo: item.orderNo,
//                   orderInfoData: item,
//                 });
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   flex: 1.1,
//                 }}
//               >
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignSelf: "center",
//                     flex: 1,
//                   }}
//                 >
//                   <Text
//                     style={[
//                       {
//                         fontFamily: font.latoBold,
//                         color: color.ly_blue,
//                         fontSize: 16,
//                       },
//                     ]}
//                   >
//                     {"#" + item.orderNo}
//                   </Text>
//                 </View>
//
//                 {this.state.selctedOrderType ==
//                   baseConstants.PENDING_ORDER_STATUS &&
//                 item.pickupDriver != 2 ? (
//                   <TouchableOpacity
//                     style={{ flex: 0.9 }}
//                     onPress={() => {
//                       selectedOrderID = item.orderId;
//                       updateStatus = item.pickupDriver == 0 ? 1 : 2;
//
//                       this.setState({
//                         alertMessage:
//                           item.pickupDriver == 0
//                             ? "Are you sure you want to Start tracking for the Order?"
//                             : "Are you sure you want to Complete the Order?",
//                         isNormalDilogVisible: true,
//                       });
//                     }}
//                   >
//                     <View
//                       style={{
//                         backgroundColor: color.ly_blue,
//                         alignSelf: "center",
//                         paddingVertical: 10,
//                         paddingHorizontal: 10,
//                         borderRadius: 16,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <Text
//                         style={[
//                           {
//                             textTransform: "uppercase",
//                             fontFamily: font.latoBold,
//                             color: color.white,
//                             fontSize: 16,
//                           },
//                         ]}
//                       >
//                         {item.pickupDriver == 0
//                           ? "Start Tracking"
//                           : "Complete Order"}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 ) : null}
//               </View>
//               <Text
//                 style={[
//                   {
//                     fontFamily: font.latoBold,
//                     color: color.ly_blue,
//                     fontSize: 16,
//                     flexShrink: 1,
//                   },
//                 ]}
//               >
//                 {" " + item.locationName}
//               </Text>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <TouchableOpacity
//                   onPress={() => {
//                     Linking.openURL(`tel:${item.contactNo}`);
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       marginTop: 3,
//                       alignItems: "center",
//                     }}
//                   >
//                     <View
//                       style={{
//                         borderRadius: 12,
//                         marginEnd: 6,
//                         backgroundColor: color.bcotGreen,
//                         height: 25,
//                         width: 25,
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Image
//                         style={{
//                           tintColor: color.white,
//                           height: 18,
//                           width: 18,
//                           alignSelf: "center",
//                         }}
//                         source={images.phone}
//                         resizeMode={"contain"}
//                       />
//                     </View>
//                     <Text
//                       style={[
//                         {
//                           fontFamily: font.latoBold,
//                           color: color.ly_blue,
//                           fontSize: 16,
//                         },
//                       ]}
//                     >
//                       {item.contactNo}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//
//                 <Text
//                   style={[
//                     styles.menuTwoText,
//                     {
//                       fontFamily: font.latoBold,
//                       color: color.ly_blue,
//                       fontSize: 16,
//                     },
//                   ]}
//                 >
//                   {strings.poundSymbol + item.netTotal}
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <View>
//                   <Text
//                     style={[
//                       styles.menuTwoText,
//                       {
//                         fontFamily: font.latoBold,
//                         color: color.ly_blue,
//                         fontSize: 16,
//                       },
//                     ]}
//                   >
//                     {item.customerName}
//                   </Text>
//                 </View>
//                 <Image
//                   style={{
//                     tintColor: color.ly_blue,
//                     height: 18,
//                     width: 18,
//                     alignSelf: "center",
//                     transform: [{ scaleX: -1 }],
//                   }}
//                   source={images.backghetto_}
//                   resizeMode={"contain"}
//                 />
//               </View>
//
//               {/* time and ordertype */}
//
//               <View
//                 style={{
//                   marginTop: 10,
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <View style={{ flexDirection: "row", alignSelf: "center" }}>
//                   <Image
//                     style={{
//                       tintColor: color.ly_red,
//                       height: 18,
//                       width: 18,
//                       alignSelf: "center",
//                     }}
//                     source={images.calendar}
//                     resizeMode={"contain"}
//                   />
//                   <Text
//                     style={[
//                       {
//                         fontFamily: font.latoBold,
//                         color: color.ly_red,
//                         fontSize: 16,
//                       },
//                     ]}
//                   >
//                     {" " + item.orderdatedisplay + " " + item.contactTime}
//                   </Text>
//                 </View>
//
//                 {/* order type */}
//                 <View style={{ alignItems: "flex-end" }}>
//                   <Text
//                     style={[
//                       {
//                         fontFamily: font.latoBold,
//                         color: color.ly_blue,
//                         fontSize: 16,
//                       },
//                     ]}
//                   >
//                     {item.orderType}
//                   </Text>
//
//                   <Text
//                     style={[
//                       {
//                         fontFamily: font.latoBold,
//                         color: color.ly_blue,
//                         fontSize: 16,
//                       },
//                     ]}
//                   >
//                     {item.paymentMode}
//                   </Text>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   height: 0.5,
//                   width: "100%",
//                   backgroundColor: color.ly_blue,
//                   marginTop: 20,
//                 }}
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     );
//   };
//
//   getFormatedDate = (orderdate) => {
//     let d = moment(Date(orderdate)).format("DD-MM-YYYY");
//     return (
//       <Text style={[{ fontFamily: font.latoBold, color: color.ly_blue }]}>
//         {/* {"Order Date - " + moment(new Date(item.orderdate), 'DD-MM-YYYY')} */}
//         {}
//       </Text>
//     );
//   };
//
//   displayAllDialog = () => {
//     return (
//       <View>
//         <SingleButtonAlertDialog
//           visible={this.state.isNotificationDialog}
//           message={this.state.alertMessage}
//           onClickButton={() => {
//             this.getOrderTask(selectedOrderstatus);
//             this.setState({
//               isNotificationDialog: false,
//               alertMessage: "",
//             });
//           }}
//         />
//         <TwoButtonAlertDialog
//           visible={this.state.isDilogVisible}
//           errorMessage={this.state.alertMessage}
//           negativeText={"CANCEL"}
//           positiveText={"LOGOUT"}
//           onClickCancelButton={() =>
//             this.setState({ isDilogVisible: false, alertMessage: "" })
//           }
//           onClickPositiveButton={() => {
//             this.setState({ isDilogVisible: false, alertMessage: "" });
//             this.onClickLogout();
//           }}
//         />
//         <TwoButtonAlertDialog
//           visible={this.state.isBatteryDialog}
//           errorMessage={this.state.alertMessage}
//           negativeText={"DENY"}
//           positiveText={"ALLOW"}
//           onClickCancelButton={() =>
//             this.setState({ isBatteryDialog: false, alertMessage: "" })
//           }
//           onClickPositiveButton={() => {
//             this.setState({ isBatteryDialog: false, alertMessage: "" });
//             this.onClickBattery();
//           }}
//         />
//         <TwoButtonAlertDialog
//           visible={this.state.isNormalDilogVisible}
//           errorMessage={this.state.alertMessage}
//           negativeText={"No"}
//           positiveText={"Yes"}
//           onClickCancelButton={() =>
//             this.setState({ isNormalDilogVisible: false, alertMessage: "" })
//           }
//           onClickPositiveButton={() => {
//             //this.requestLocationPermission();
//             Geolocation.getCurrentPosition(
//               (info) => {
//                 console.log("info :  ", info);
//                 this.setState({
//                   currentLatitude: info.coords.latitude,
//                   currentLongitude: info.coords.longitude,
//                 });
//                 if (info.coords.latitude != "" && info.coords.longitude != "") {
//                   this.updateDriverPickup(
//                     info.coords.latitude,
//                     info.coords.longitude
//                   );
//                   this.setState({
//                     isNormalDilogVisible: false,
//                     alertMessage: "",
//                   });
//                 }
//               },
//               (error) => console.log("Error message: ", error.message),
//               {
//                 timeout: 30000,
//               }
//             );
//             // setTimeout(() => {
//             //   this.updateDriverPickup();
//             // }, 500);
//           }}
//         />
//       </View>
//     );
//   };
//
//   render() {
//     return (
//       <SafeAreaView
//         style={{ flex: 1, backgroundColor: color.bcot_background_dark }}
//       >
//         {this.displayAllDialog()}
//
//         <View style={styles.container}>
//           <ImageBackground resizeMode={"stretch"} style={{ flex: 1 }}>
//             <MyStatusBar />
//             <Loader isLoading={this.state.isloading} />
//             <View
//               style={{
//                 height: 50,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{
//                   fontFamily: font.latoBold,
//                   fontSize: 24,
//                   color: color.ly_blue,
//                   alignSelf: "center",
//                 }}
//               >
//                 ORDERS
//               </Text>
//             </View>
//             {this.renderOrderTypeSelction()}
//             {this.renderDisplayOrderlist()}
//             {this.renderLogout()}
//           </ImageBackground>
//         </View>
//       </SafeAreaView>
//     );
//   }
//
//   onClickBattery = () => {
//     try {
//       // "null" is your app
//       RNAndroidSettingsTool.ACTION_APPLICATION_DETAILS_SETTINGS(
//         "com.LYPizzaManagerDriver"
//       ); // Show notification settings for your app.
//       // or other app (ex. Facebook)
//       pref_setBattery("2");
//     } catch (e) {
//       // your code
//     }
//   };
//   onClickLogout = () => {
//     this.setState({
//       isloading: true,
//     });
//     this.props
//       .dispatch(
//         logoutSmartApp(
//           userInfo.userDetail[0].userId,
//           userInfo.userDetail[0].type == 2 ? 1 : 2
//         )
//       )
//       .then(() => {
//         this.setState({
//           isloading: false,
//         });
//         if (this.props.data.error) {
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data,
//           });
//         } else if (this.props.data.data.status != 1) {
//           this.setState({
//             isDialogVisible: true,
//             alertMessage: this.props.data.data.result,
//           });
//         } else {
//           ReactNativeForegroundService.stop();
//           clearLogin();
//
//           const resetAction = StackActions.reset({
//             index: 0,
//             actions: [NavigationActions.navigate({ routeName: "login" })],
//           });
//
//           this.props.navigation.dispatch(resetAction);
//         }
//       });
//   };
//
//   renderLogout = () => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           this.setState({
//             alertMessage: "Are you sure you want to logout?",
//             isDilogVisible: true,
//           });
//         }}
//         style={{
//           height: 50,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: color.ly_red,
//           marginHorizontal: 20,
//           borderRadius: 10,
//         }}
//       >
//         <Text
//           style={{
//             fontFamily: font.latoBold,
//             fontSize: 24,
//             color: color.white,
//             alignSelf: "center",
//           }}
//         >
//           LOGOUT
//         </Text>
//       </TouchableOpacity>
//     );
//   };
// }
//
// export function checkisLogin() {}
// function mapStateToProps(state) {
//   //console.log("state Body home")
//   //console.log(state)
//   return {
//     data: state.data,
//   };
// }
// export default connect(mapStateToProps)(Home);
