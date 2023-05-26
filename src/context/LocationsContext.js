import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Location from 'expo-location';
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import uuid from 'react-native-uuid';
import mySound from '../assets/alert.mp3';

export const LocationsContext = createContext({});

export function LocationsContextProvider(props) {
  const [selectedAudio, setSelectedAudio] = useState(null)

  const [currentLocation, setCurrentLocation] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [LocationsList, setLocationsList] = useState([])

  async function addLocationAlarm(newLocationAlarm) {
    const newLocationAlarmList = [
      ...LocationsList,
      {
        id: uuid.v4(),
        ...newLocationAlarm
      }
    ]
    await AsyncStorage.setItem('locations', JSON.stringify(newLocationAlarmList));

    loadData()

    ToastAndroid.show('Localização adicionada Adicionada', ToastAndroid.SHORT);
  }

  async function deleteLocationAlarm(currentLocation) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => console.log('Não pressed'),
        },
        {
          text: 'Sim',
          onPress: async () => {

            const newLocationAlarmList = LocationsList.filter(item => item.id !== currentLocation.id);

            await AsyncStorage.setItem('locations', JSON.stringify(newLocationAlarmList));

            loadData()

            ToastAndroid.show('Localização Removida', ToastAndroid.SHORT);
          },
        },
      ])
  }

  const loadData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('locations');
      if (value !== null) {
        setLocationsList(JSON.parse(value))
      } else {
        await AsyncStorage.setItem('locations', JSON.stringify([]))
      }

      const { sound } = await Audio.Sound.createAsync(mySound, { isLoping: true });
      setSelectedAudio(sound);

    } catch (error) {
      console.log(error)
    }
  }, [])

  const getCurrentLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro ao liberar as permissões", "Permissão para acessar a localização não foi concedida.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location);
  }, [])

  useEffect(() => {
    loadData()
    getCurrentLocation();
  }, [loadData, getCurrentLocation]);

  useEffect(() => {
    Location.watchPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setCurrentLocation(response)
    })
  }, [])

  return (
    <LocationsContext.Provider
      value={{
        LocationsList, setLocationsList,
        addLocationAlarm,
        deleteLocationAlarm,
        currentLocation, setCurrentLocation,
        getCurrentLocation,
        selectedLocation, setSelectedLocation, selectedAudio
      }}
    >
      {props.children}
    </LocationsContext.Provider>
  );
}
