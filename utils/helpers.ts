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
