import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
} from "react-native-maps";
import {
  HOME_LOCATION,
  INITIAL_REGION,
  TEST_GEOFENCING_LOCATIONS,
  WORK_LOCATION,
} from "@/constants/Constants";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/utils/handlePushNotifications";
import * as Notifications from "expo-notifications";

let foregroundSubscription: any = null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function TabOneScreen() {
  // Notifications code
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [state, setState] = useState({
    distance: 700,
    showCircle: true,
    markers: [],
  });

  const mapRef = useRef<any>();

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
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      startForegroundUpdate();
    })();
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (location) {
      if (
        location.longitude == HOME_LOCATION.longitude &&
        location.latitude === HOME_LOCATION.latitude
      ) {
        sendPushNotification(expoPushToken, {
          title: "Location Change",
          body: " You've reached home",
        });
      }
    }
  }, [location]);
  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS == "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
      >
        {TEST_GEOFENCING_LOCATIONS.map((locationElt) => (
          <Circle
            key={locationElt.key}
            center={locationElt}
            radius={700}
            strokeColor="rgba(0, 100, 181, 1.1)"
            fillColor="rgba(0, 100, 180, 0.2)"
          />
        ))}

        <Marker key="Work" coordinate={WORK_LOCATION} />
      </MapView>
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
    backgroundColor: "rgba(0,0,0,0.5)",
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

{
  /* <meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="AIzaSyDk6H-6sJuDi0s-c5Jh8eBaZQ-xH-4olCA"
/>; */
}
