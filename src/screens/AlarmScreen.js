import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib';
import { Box, Button, HStack, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, ToastAndroid, useWindowDimensions } from 'react-native';
import { useLocations } from '../hooks/useLocations';

import Mapbox from '@rnmapbox/maps';
import circle from '@turf/circle';

Mapbox.setAccessToken('pk.eyJ1IjoiZmlsaXBlbGVvbmVsYmF0aXN0YSIsImEiOiJjbDA5dWF5YXIwZ3oxM2tudDhsajBoY3M4In0.RYxLDG-hEGzrglaAPykBxw');

var options = { steps: 100, units: 'kilometers', properties: { foo: 'bar' } };

export default function AlarmScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const { selectedLocation, currentLocation, selectedAudio } = useLocations();
  const [isPlaying, setIsPlaying] = useState(false);

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
      selectedAudio.playAsync();
    } else {
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
          zoomLevel={15}
          centerCoordinate={[selectedLocation.position.longitude, selectedLocation.position.latitude]}
        />
        <Mapbox.UserLocation visible={true} />
        <Mapbox.PointAnnotation
          id="my_location"
          title="Your location"
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
