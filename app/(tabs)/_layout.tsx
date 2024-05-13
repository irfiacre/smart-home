import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";
import { showAlert } from "@/utils/helpers";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [motionDetected, setMotionDetected] = useState(false);
  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
      if (acceleration > 2) {
        setMotionDetected(true);
        showAlert("Motion Detection", "Device is in Motion");
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
            <Ionicons name="footsteps-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
