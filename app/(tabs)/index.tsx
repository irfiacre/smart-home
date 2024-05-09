import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  HOME_LOCATION,
  INITIAL_REGION,
  WORK_LOCATION,
} from "@/constants/Constants";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/utils/handlePushNotifications";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

let foregroundSubscription: any = null;

export default function TabOneScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
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

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    let message = "Location update";
    if (location) {
      if (
        location.latitude === WORK_LOCATION.latitude &&
        location.longitude === WORK_LOCATION.longitude
      ) {
        message = "You Have reached at Work!";
      } else if (
        location.latitude === WORK_LOCATION.latitude &&
        location.longitude === WORK_LOCATION.longitude
      ) {
        message = "You Have reached at Home!";
      }

      sendPushNotification({
        expoPushToken,
        title: "Location Update",
        messageTxt: message,
      });
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [location]);

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
        <Marker key="Home" coordinate={HOME_LOCATION} />
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
});
