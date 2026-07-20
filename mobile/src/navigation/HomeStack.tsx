import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import SelfAssessmentFormScreen from "../screens/assessment/SelfAssessmentFormScreen";
import SelfAssessmentResultScreen from "../screens/assessment/SelfAssessmentResultScreen";
import GuideScreen from "../screens/home/GuideScreen";

export type HomeStackParamList = {
  HomeMain: undefined;
  SelfAssessmentForm: undefined;
  SelfAssessmentResult: { result: any };
  Guide: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SelfAssessmentForm" component={SelfAssessmentFormScreen} />
      <Stack.Screen name="SelfAssessmentResult" component={SelfAssessmentResultScreen} />
      <Stack.Screen name="Guide" component={GuideScreen} />
    </Stack.Navigator>
  );
}