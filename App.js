import 'expo-dev-client';
import 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar } from "native-base";
import React from "react";
import Router from './Router'
import { LocationsContextProvider } from "./src/context/LocationsContext";

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor={"#000"} barStyle={"light-content"} />
      <LocationsContextProvider>
        <Router />
      </LocationsContextProvider>
    </NativeBaseProvider>
  );
}