import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib';
import { Box, Button, HStack, VStack } from 'native-base';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ToastAndroid, useWindowDimensions } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useLocations } from '../hooks/useLocations';

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

      <MapView
        showsUserLocation
        style={{
          flex: 1,
        }}
        initialRegion={{
          latitude: selectedLocation.position.latitude,
          longitude: selectedLocation.position.longitude,
          latitudeDelta: 0.0154,
          longitudeDelta: 0.0178,
        }}
      >
        <Circle
          fillColor='#00000066'
          strokeColor='#000000'
          strokeWidth={3}
          radius={selectedLocation.ratio}
          center={{
            latitude: selectedLocation.position.latitude,
            longitude: selectedLocation.position.longitude,
          }}
        />
        <Marker
          coordinate={{
            latitude: selectedLocation.position.latitude,
            longitude: selectedLocation.position.longitude,
          }}
        />
      </MapView>

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
