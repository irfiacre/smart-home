import { getDistance } from "geolib";
import { Alert } from "react-native";

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
  lat1: number,
  long2: number,
  lat2: number
): number => {
  if (long1 === long2 && lat1 === lat2) {
    return 0;
  }
  return getDistance(
    { longitude: long1, latitude: lat1 },
    { longitude: long2, latitude: lat2 },
    1
  );
};
