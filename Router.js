import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/screens/Home";
import Onboarding from "./src/screens/Onboarding";
import AddLocation from "./src/screens/AddLocation";
import Config from "./src/screens/Config";
import AlarmScreen from "./src/screens/AlarmScreen";

const Stack = createStackNavigator();

export default function Routes() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"Onboarding"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
        />
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="AddLocation"
          component={AddLocation}
        />
        <Stack.Screen
          name="Config"
          component={Config}
        />
        <Stack.Screen
          name="AlarmScreen"
          component={AlarmScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}