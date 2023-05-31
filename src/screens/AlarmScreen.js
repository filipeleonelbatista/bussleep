import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib';
import { Box, Button, HStack, VStack } from 'native-base';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ToastAndroid, View, useWindowDimensions } from 'react-native';
import { useLocations } from '../hooks/useLocations';

import Mapbox from '@rnmapbox/maps';
import circle from '@turf/circle';
import midpoint from '@turf/midpoint';
import distance from '@turf/distance';

Mapbox.setAccessToken('pk.eyJ1IjoiZmlsaXBlbGVvbmVsYmF0aXN0YSIsImEiOiJjbDA5dWF5YXIwZ3oxM2tudDhsajBoY3M4In0.RYxLDG-hEGzrglaAPykBxw');

var options = { steps: 100, units: 'kilometers', properties: { foo: 'bar' } };

export default function AlarmScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const { selectedLocation, currentLocation, selectedAudio } = useLocations();
  const [isPlaying, setIsPlaying] = useState(false);

  const centralizedCamera = useMemo(() => {
    return midpoint([currentLocation?.coords?.longitude, currentLocation?.coords?.latitude],
      [selectedLocation?.position?.longitude, selectedLocation?.position?.latitude])
  }, [currentLocation])

  const desiredZoom = useMemo(() => {
    const dist = distance([currentLocation?.coords?.longitude, currentLocation?.coords?.latitude],
      [selectedLocation?.position?.longitude, selectedLocation?.position?.latitude], { units: 'kilometers' })
    let zoomLevel;

    if (dist <= 0.2) {
      zoomLevel = 17
    } else if (dist <= 0.5) {
      zoomLevel = 16
    } else if (dist <= 1) {
      zoomLevel = 15; // Zoom de nível 15 para distâncias menores ou iguais a 1 km
    } else if (dist <= 2) {
      zoomLevel = 14; // Zoom de nível 12 para distâncias entre 1 e 2 km
    } else if (dist <= 5) {
      zoomLevel = 12; // Zoom de nível 12 para distâncias entre 2 e 5 km
    } else {
      zoomLevel = 10; // Zoom de nível 10 para distâncias maiores que 5 km
    }

    return zoomLevel;
  }, [currentLocation])

  const handleDisabledAlarm = () => {
    Alert.alert("Deseja desativar este alarme?", "", [
      {
        text: 'Não',
        style: 'cancel',
        onPress: () => console.log('Não pressed'),
      },
      {
        text: 'Sim',
        onPress: async () => {
          ToastAndroid.show('Alarme desativado', ToastAndroid.SHORT);
          selectedAudio.stopAsync();
          navigation.navigate("Home")
        },
      },
    ])
  }

  useEffect(() => {
    const result = getDistance(
      { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
      { latitude: selectedLocation.position.latitude, longitude: selectedLocation.position.longitude }
    );
    if (result <= selectedLocation.ratio) {
      selectedAudio.setIsLoopingAsync(true)
      setIsPlaying(true)
      selectedAudio.playAsync();
    } else {
      setIsPlaying(false)
      selectedAudio.stopAsync();
    }
  }, [currentLocation]);

  return (
    <VStack
      width={'100%'}
      height={height}
      position={"relative"}
      justifyContent={'center'}
    >
      <HStack
        width={'100%'}
        bgColor="black"
        alignItems="center"
        paddingHorizontal={8}
        paddingVertical={8}
        space={4}
      >
        <Button
          onPress={handleDisabledAlarm}
          variant={"unstyled"}
          _pressed={{ bg: 'gray.900' }}
          _text={{
            color: "white",
            fontSize: 16,
          }}
          leftIcon={
            <Feather name="chevron-left" size={28} color="#FFF" />
          }
        >
          Alarme ativo
        </Button>
      </HStack>

      <Mapbox.MapView
        id="map"
        scaleBarEnabled={false}
        style={{
          flex: 1,
        }}
        styleURL={Mapbox.StyleURL.Street}
      >
        <Mapbox.Camera
          animationMode="flyTo"
          animationDuration={2000}
          zoomLevel={desiredZoom}
          centerCoordinate={centralizedCamera.geometry.coordinates}
        />
        {
          currentLocation?.coords && (
            <Mapbox.PointAnnotation
              id="selected_location"
              aboveLayerID="routeSource"
              coordinate={[currentLocation?.coords?.longitude, currentLocation?.coords?.latitude]}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: '#4286f5',
                  borderRadius: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{
                  height: 20,
                  width: 20,
                  backgroundColor: '#4286f5',
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 3
                }} />
              </View>
            </Mapbox.PointAnnotation>
          )
        }
        <Mapbox.PointAnnotation
          id="my_location"
          title="Your destination"
          aboveLayerID="routeSource"
          coordinate={[selectedLocation.position.longitude, selectedLocation.position.latitude]}
        />
        <Mapbox.ShapeSource
          id='routeSource'
          shape={
            circle([selectedLocation.position.longitude, selectedLocation.position.latitude], selectedLocation.ratio / 1000, options)
          }
        >
          <Mapbox.FillLayer
            id="radiusFill"
            style={{ fillColor: 'rgba(0, 0, 0, 0.3)' }}
          />
          <Mapbox.LineLayer
            id="radiusOutline"
            style={{
              lineColor: '#000000',
              lineWidth: 3,
            }}
            aboveLayerID="radiusFill"
          />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>

      <Box
        position={"absolute"}
        width={'100%'}
        top={20}
        alignItems={'center'}
      >
        <Box
          px={8}
          py={4}
          minW={'70%'}
          maxW={'90%'}
          borderRadius={"full"}
          bgColor={"black"}
          alignItems={"center"}
          _text={{ color: 'white', fontWeight: 'bold' }}
        >
          {isPlaying ? 'Você está próximo do destino' : selectedLocation.destination}
        </Box>
      </Box>

      <Box
        position={"absolute"}
        width={'100%'}
        bottom={15}
        alignItems={'center'}
      >
        <Button
          marginY={8}
          size={"lg"}
          _pressed={{ bg: 'gray.900' }}
          bgColor={"black"}
          _text={{
            color: "white",
            fontSize: 16,
          }}
          leftIcon={
            <Feather name="bell" size={24} color="#FFF" />
          }
          onPress={handleDisabledAlarm}
        >
          Finalizar o alarme
        </Button>
      </Box>
    </VStack>
  )
}
