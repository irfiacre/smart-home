import { getDistance } from "geolib";
import { Alert, Linking, PermissionsAndroid, ToastAndroid } from "react-native";

export const showAlert = (title: string, message: string) =>
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () => null,
    }
  );

const radians = (degrees: number) => (degrees * Math.PI) / 180;

// distance computation using Haversine formula
export const calculateDistance = (
  long1: number,
  long2: number,
  lat1: number,
  lat2: number
): number =>
  getDistance(
    { longitude: long1, latitude: lat1 },
    { longitude: long2, latitude: lat2 },
    1
  );

const requestModifySettingsPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_SETTINGS;

  try {
    const granted = await PermissionsAndroid.request(permission, {
      title: "Modify System Settings Permission",
      message: "This app needs access to modify system settings.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can modify system settings");
      ToastAndroid.show("Permission granted", ToastAndroid.SHORT);
    } else {
      console.log("Modify system settings permission denied");
      ToastAndroid.show("Permission denied", ToastAndroid.SHORT);
    }
  } catch (err) {
    console.warn(err);
  }
};

export const checkAndRequestModifySettingsPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_SETTINGS;

  const hasPermission = await PermissionsAndroid.check(permission);

  if (!hasPermission) {
    // Open the system settings to manually grant the permission
    Linking.openSettings();
    return false;
  } else {
    console.log("Already has permission");
  }
  return true;
};
