import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { colors } from "../theme/colors";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ProfileSetupScreen from "../screens/onboarding/ProfileSetupScreen";
import BottomTabs from "./BottomTabs";
import { useLanguageStore } from "../store/useLanguageStore";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, hasCompletedOnboarding, isLoading, hydrate } = useAuthStore();
  const { hydrate: hydrateLanguage } = useLanguageStore();
  const { hydrate: hydrateNotifications } = useNotificationStore();

  useEffect(() => {
    hydrate();
    hydrateLanguage();
    hydrateNotifications();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : !hasCompletedOnboarding ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <Stack.Screen name="MainTabs" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
