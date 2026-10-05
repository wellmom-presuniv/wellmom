import { APP_NAME } from "../constants/app";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }

    const permission = await Notifications.requestPermissionsAsync();
    return permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  } catch (error) {
    console.warn("Notification permission request failed:", error);
    return false;
  }
}

export async function sendLocalNotification(body: string, title = `${APP_NAME} Reminder`) {
  try {
    const permission = await Notifications.getPermissionsAsync();
    if (!(permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
      },
      trigger: null,
    });
    return true;
  } catch (error) {
    console.warn("Failed to schedule local notification:", error);
    return false;
  }
}

export async function ensureNotificationPermissions() {
  if (Platform.OS === "web") {
    return false;
  }
  return requestNotificationPermission();
}
