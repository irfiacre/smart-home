import "expo-dev-client";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";
import { LightSensor } from "expo-sensors";
import * as Brightness from "expo-brightness";
import { Platform } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // let [loaded, error] = useState(true);
  let loaded = true;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, []);

  return <RootLayoutNav />;
}

const changeBrightness = async (value: number) => {
  const { status } = await Brightness.requestPermissionsAsync();
  if (status === "granted") {
    Brightness.setSystemBrightnessAsync(value);
  }
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [{ illuminance }, setData] = useState({ illuminance: 0 });
  useEffect(() => {
    if (Platform.OS === "android") {
      _toggle();

      return () => {
        _unsubscribe();
      };
    } else {
      console.warn(
        `Ambient Sensor is not supported on ${Platform.OS} platform!`
      );
    }
  }, []);

  const _toggle = () => {
    if (this._subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    this._subscription = LightSensor.addListener(setData);
  };

  const _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };
  useEffect(() => {
    if (illuminance >= 0 || illuminance <= 50) {
      changeBrightness(0.3);
    } else if (illuminance >= 50 || illuminance <= 300) {
      changeBrightness(0.5);
    } else if (illuminance >= 300 || illuminance <= 1000) {
      changeBrightness(0.8);
    } else {
      changeBrightness(1);
    }
  }, [illuminance]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
