// import React, { Component } from "react";
// import {
//   SafeAreaView,
//   ImageBackground,
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import styles from "../styles/home";
// import { connect } from "react-redux";
// import font from "../constants/font";
// import images from "../constants/images";
// import color from "../constants/color";
// import MyStatusBar from "../components/statusbar";
// import { getCurrentLatLongDeliveryAgent } from "../redux/actions";
// import MapViewDirections from "react-native-maps-directions";
// import MapView, { Marker, AnimatedRegion } from "react-native-maps";
// let orderId = "";
// let orderNo = "";
// let item = "";
// let GOOGLE_MAPS_APIKEY = "YOUR MAP API KEY";
//
// const LATITUDE = 23.6033778;
// const LONGITUDE = 72.3606055;
// const LATITUDE_DELTA = 0.02;
// const LONGITUDE_DELTA = 0.02;
//
// class MapScreen extends Component {
//   constructor(props) {
//     super(props);
//     orderId = this.props.navigation.getParam("orderId", "");
//     orderNo = this.props.navigation.getParam("orderNo", "");
//     item = this.props.navigation.getParam("orderInfoData", "");
//     this.state = {
//       orderlist: [],
//       selctedOrderType: 2,
//       isDilogVisible: false,
//       isNotificationDialog: false,
//       isNormalDilogVisible: false,
//       alertMessage: "",
//       objDriverLocation: {},
//       islocationReceive: false,
//       OrderObject: {},
//       currentLatitude: 0,
//       currentLongitude: 0,
//       region: {
//         latitude: Number(item.orderedItems[0].latitude),
//         longitude: Number(item.orderedItems[0].longitude),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       },
//       coordinate: new AnimatedRegion(),
//     };
//     this.setState({
//       coordinate: new AnimatedRegion({
//         latitude: Number(item.orderedItems[0].latitude),
//         longitude: Number(item.orderedItems[0].longitude),
//       }),
//     });
//     // console.log("-========== resulttt ", this.props.data);
//     this.getDriverLocation();
//   }
//   //   componentDidMount() {
//   //     console.log("-========== resulttt ", this.props.data);
//   //     this.getDriverLocation();
//   //   }
//
//   animate() {
//     const { coordinate } = this.state;
//     const newCoordinate = {
//       latitude: Number(this.state.objDriverLocation.driverDetail[0].Latitude),
//       longitude: Number(this.state.objDriverLocation.driverDetail[0].Longitude),
//     };
//
//     if (Platform.OS === "android") {
//       if (this.marker) {
//         this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
//       }
//     } else {
//       coordinate.timing(newCoordinate).start();
//     }
//   }
//
//   getDriverLocation = () => {
//     this.props
//       .dispatch(
//         getCurrentLatLongDeliveryAgent(item.orderedItems[0].driverId, orderId)
//       )
//       .then(() => {
//         console.log("-========== resul1111 ", this.props.data.data);
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
//           this.setState(
//             {
//               islocationReceive: true,
//               objDriverLocation: this.props.data.data.result,
//             },
//             () => {
//               this.getInitialState();
//             }
//           );
//
//           setTimeout(() => {
//             this.getDriverLocation();
//           }, 5000);
//         }
//       });
//   };
//   getInitialState() {
//     this.setState({
//       region: {
//         latitude: Number(this.state.objDriverLocation.driverDetail[0].Latitude),
//         longitude: Number(
//           this.state.objDriverLocation.driverDetail[0].Longitude
//         ),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       },
//     });
//     this.animate();
//   }
//   render() {
//     return (
//       <SafeAreaView
//         style={{ flex: 1, backgroundColor: color.bcot_background_dark }}
//       >
//         <View style={styles.container}>
//           <ImageBackground resizeMode={"stretch"} style={{ flex: 1 }}>
//             <MyStatusBar />
//             {this.renderHeader()}
//             {this.renderMap()}
//           </ImageBackground>
//         </View>
//       </SafeAreaView>
//     );
//   }
//
//   renderMap = () => {
//     return (
//       <View style={{ flex: 1, paddingTop: 10 }}>
//         {this.state.islocationReceive ? (
//           <MapView
//             style={{ height: "100%", width: "100%" }}
//             // provider={PROVIDER_GOOGLE}
//             initialRegion={{
//               latitude: Number(
//                 this.state.objDriverLocation.driverDetail[0].Latitude
//               ),
//               longitude: Number(
//                 this.state.objDriverLocation.driverDetail[0].Longitude
//               ),
//               latitudeDelta: LATITUDE_DELTA,
//               longitudeDelta: LONGITUDE_DELTA,
//             }}
//             region={this.state.region}
//             onRegionChangeComplete={(region) => this.setState({ region })}
//           >
//             <MapViewDirections
//               origin={{
//                 latitude: Number(item.orderedItems[0].startlatitude),
//                 longitude: Number(item.orderedItems[0].startlongitude),
//               }}
//               destination={{
//                 latitude: Number(item.orderedItems[0].latitude),
//                 longitude: Number(item.orderedItems[0].longitude),
//               }}
//               apikey={GOOGLE_MAPS_APIKEY}
//               strokeWidth={3}
//               strokeColor="hotpink"
//             />
//
//             {/* Driver Position */}
//
//             <Marker.Animated
//               ref={(marker) => {
//                 this.marker = marker;
//               }}
//               coordinate={this.state.coordinate}
//               title={"Driver"}
//               description={item.orderedItems[0].drivername}
//             >
//               <Image
//                 source={images.deliverymarker}
//                 style={{
//                   height: 40,
//                   width: 40,
//                   marginBottom: Platform.OS == "android" ? 0 : 30,
//                 }}
//               />
//             </Marker.Animated>
//
//             {/* Restaurant */}
//             <Marker
//               coordinate={{
//                 latitude: Number(item.orderedItems[0].startlatitude),
//                 longitude: Number(item.orderedItems[0].startlongitude),
//               }}
//               title={"Restaurant"}
//             >
//               <Image
//                 source={images.restaurant}
//                 style={{ height: 40, width: 40 }}
//               />
//             </Marker>
//             {/* Destination */}
//             <Marker
//               coordinate={{
//                 latitude: item.orderedItems[0].latitude,
//                 longitude: item.orderedItems[0].longitude,
//               }}
//               title={item.deliveryAddress}
//               description={"Delivery Address"}
//             >
//               <Image
//                 source={images.destinationmarker}
//                 style={{
//                   height: 40,
//                   width: 40,
//                   marginBottom: Platform.OS == "android" ? 0 : 30,
//                 }}
//               />
//             </Marker>
//           </MapView>
//         ) : null}
//         <View
//           style={{
//             width: "60%",
//             position: "absolute",
//             top: 10,
//             start: 10,
//             borderRadius: 10,
//             padding: 7,
//             backgroundColor: "white",
//             shadowColor: "#000000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.5,
//             shadowRadius: 1,
//             elevation: 3,
//           }}
//         >
//           {/* <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color: color.black,
//               fontSize: 16,
//             }}
//           >
//             {"Address: " + item.deliveryAddress}
//           </Text> */}
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color: color.black,
//               fontSize: 16,
//             }}
//           >
//             {"Tracking"}
//           </Text>
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoRegular,
//               color: color.black,
//               fontSize: 16,
//             }}
//           >
//             {"Driver is on the way."}
//           </Text>
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color: color.black,
//               fontSize: 16,
//             }}
//           >
//             {"---------------"}
//           </Text>
//           <Text
//             style={{
//               marginStart: 10,
//               fontFamily: font.latoBold,
//               color: color.black,
//               fontSize: 16,
//             }}
//           >
//             {"Driver : " + item.orderedItems[0].drivername}
//           </Text>
//         </View>
//       </View>
//     );
//   };
//   renderHeader = () => {
//     return (
//       <View
//         style={{
//           height: 50,
//           alignItems: "center",
//           flexDirection: "row",
//           marginHorizontal: 20,
//         }}
//       >
//         <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
//           <Image
//             style={{
//               tintColor: color.ly_blue,
//               height: 18,
//               width: 18,
//               alignSelf: "center",
//             }}
//             source={images.backghetto_}
//             resizeMode={"contain"}
//           />
//         </TouchableOpacity>
//         <Text
//           style={{
//             marginStart: 10,
//             fontFamily: font.latoBold,
//             color: color.ly_blue,
//             fontSize: 22,
//           }}
//         >
//           {"Track Order #" + orderNo}
//         </Text>
//       </View>
//     );
//   };
// }
// // MapScreen.propTypes = {
// //   provider: ProviderPropType,
// // };
// function mapStateToProps(state) {
//   return {
//     data: state.data,
//   };
// }
// export default connect(mapStateToProps)(MapScreen);
