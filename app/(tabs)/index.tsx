import { Platform, StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
} from "react-native-maps";
import {
  GEOFENCING_LOCATIONS,
  INITIAL_REGION,
  WORK_LOCATION,
} from "@/constants/Constants";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/utils/handlePushNotifications";
import * as Notifications from "expo-notifications";
import { isDevice } from "expo-device";
import { calculateDistance, showAlert } from "@/utils/helpers";

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
  const [locationUpdate, setLocationUpdate] = useState({
    shouldUpdateLocation: false,
    lastLatitude: 0,
    lastLongitude: 0,
    count: 0,
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

  const LOCATION_FENCE = [{ ...GEOFENCING_LOCATIONS.school }];

  useEffect(() => {
    if (location) {
      const distance = calculateDistance(
        location.longitude,
        locationUpdate.lastLongitude,
        location.latitude,
        locationUpdate.lastLatitude
      );
      if (distance >= 200) {
        setLocationUpdate((prevState) => ({
          ...prevState,
          shouldUpdateLocation: true,
        }));
      }

      const TITLE = "Location Update";

      if (
        location.latitude !== LOCATION_FENCE[0].latitude ||
        location.longitude !== LOCATION_FENCE[0].longitude
      ) {
        const MESSAGE_BODY = `You're out of the ${LOCATION_FENCE[0].title}!!`;
        if (locationUpdate.shouldUpdateLocation) {
          if (isDevice) {
            sendPushNotification(expoPushToken, {
              title: TITLE,
              body: MESSAGE_BODY,
            });
          } else {
            showAlert(TITLE, MESSAGE_BODY);
          }
          setLocationUpdate((prevState) => ({
            ...prevState,
            shouldUpdateLocation: false,
            lastLatitude: location.latitude,
            lastLongitude: location.longitude,
            count: prevState.count + 1,
          }));
        }
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
        {LOCATION_FENCE.map((locationElt) => (
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
