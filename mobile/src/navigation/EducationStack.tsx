import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EducationListScreen from "../screens/education/EducationListScreen";
import EducationDetailScreen from "../screens/education/EducationDetailScreen";

export type EducationStackParamList = {
  EducationList: undefined;
  EducationDetail: { id: string };
};

const Stack = createNativeStackNavigator<EducationStackParamList>();

export default function EducationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EducationList" component={EducationListScreen} />
      <Stack.Screen name="EducationDetail" component={EducationDetailScreen} />
    </Stack.Navigator>
  );
}