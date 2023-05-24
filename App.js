import { NativeBaseProvider, StatusBar } from "native-base";
import React from "react";
import Router from './Router'

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle={"light-content"} />
      <Router />
    </NativeBaseProvider>
  );
}