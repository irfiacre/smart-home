import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import {
  HOME_LOCATION,
  INITIAL_REGION,
  TEST_GEOFENCING_LOCATIONS,
  WORK_LOCATION,
} from "@/constants/Constants";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
// import { startGeofencingAsync } from "expo-location";
// import {
//   registerForPushNotificationsAsync,
//   sendPushNotification,
// } from "@/utils/handlePushNotifications";
// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

let foregroundSubscription: any = null;

export default function TabOneScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [state, setState] = useState({
    distance: 700,
    showCircle: true,
    markers: [],
  });

  const navigation = useNavigation();

  const mapRef = useRef<any>();
  const onResetMap = () => {
    const rwRegion = {
      latitude: -1.9403,
      longitude: 29.8739,
      latitudeDelta: 2,
      longitudeDelta: 2,
    };
    mapRef.current?.animateToRegion(rwRegion);
  };

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }
    foregroundSubscription?.remove();
    foregroundSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation },
      (location) => {
        setLocation(location.coords);
      }
    );
  };

  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove();
    setLocation(null);
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onResetMap} style={styles.resetBtnContainer}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      ),
    });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      startForegroundUpdate();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
      >
        {/* <Marker key="Home" coordinate={HOME_LOCATION} /> */}
        {TEST_GEOFENCING_LOCATIONS.map((locationElt) => (
          <Circle
            key={locationElt.key}
            center={locationElt}
            radius={300}
            strokeColor="rgba(0, 100, 181, 1.1)"
            fillColor="rgba(0, 100, 180, 0.2)"
          />
        ))}

        <Marker key="Work" coordinate={WORK_LOCATION} />
      </MapView>
      {/* <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => console.log("Increase")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.distanceText}>
          {state.distance > 999
            ? state.distance / 1000 + " KM"
            : state.distance + " m"}
        </Text>
        <TouchableOpacity
          onPress={() => console.log("Decrease")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  resetBtnContainer: {
    padding: 10,
  },
  resetBtnText: {
    fontWeight: "600",
    fontSize: 18,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  distanceText: {
    flex: 3,
    textAlign: "center",
    color: "#FFF",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 30,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  meStyle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#67c0ff",
    opacity: 0.8,
    borderWidth: 2,
    borderColor: "#dbdbdb",
  },
});
