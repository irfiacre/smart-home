import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";
import { showAlert } from "@/utils/helpers";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "@/utils/handlePushNotifications";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function TabLayout() {
  const [motionDetected, setMotionDetected] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

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
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      if (acceleration > 1.5) {
        setMotionDetected(true);
        sendPushNotification(expoPushToken, {
          title: "Motion Detection",
          body: "Device Motion was detected!",
        });
      } else {
        setMotionDetected(false);
      }
    });
    Accelerometer.setUpdateInterval(1000);

    return () => subscription.remove();
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map-marker"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="steps"
        options={{
          title: "Steps",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
