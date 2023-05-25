import { Box, Button, HStack, Text } from 'native-base';
import { useLocations } from '../hooks/useLocations';
import MapView, { Circle, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

export default function AlarmItem({ item, ...props }) {
  const navigation = useNavigation();
  const { deleteLocationAlarm, setSelectedLocation } = useLocations();
  return (
    <Box
      {...props}
      margin={2}
      borderRadius={8}
      shadow={4}
      bgColor={"white"}
    >
      <Box
        borderTopLeftRadius={8}
        borderTopRightRadius={8}
        width={"100%"}
        height={130}
        bgColor={"gray.400"}
        position={"relative"}
      >
        <MapView
          style={{
            width: '100%',
            height: 130,
            borderRadius: 8,
          }}
          initialRegion={{
            latitude: item.position.latitude,
            longitude: item.position.longitude,
            latitudeDelta: 0.0154,
            longitudeDelta: 0.0178,
          }}
        >
          <Circle
            fillColor='#00000066'
            strokeColor='#000000'
            strokeWidth={3}
            radius={item.ratio}
            center={{
              latitude: item.position.latitude,
              longitude: item.position.longitude,
            }}
          />
          <Marker
            coordinate={{
              latitude: item.position.latitude,
              longitude: item.position.longitude,
            }}
          />
        </MapView>
        <Box
          w={"100%"}
          h={35}
          position={"absolute"}
          bottom={0}
          bgColor="gray.900:alpha.70"
          padding={2}
        >
          <Text fontSize={14} color="white">{item.destination}</Text>
        </Box>
      </Box>
      <HStack>
        <Button
          _pressed={{ bg: 'green.600' }}
          _text={{ fontSize: 18, color: 'green.500' }}
          variant={"outline"}
          width={"50%"}
          onPress={() => {
            setSelectedLocation(item)
            navigation.navigate("AlarmScreen")
          }}
        >
          Ativar
        </Button>
        <Button
          _pressed={{ bg: 'red.600' }}
          _text={{ fontSize: 18, color: 'red.400' }}
          variant={"outline"}
          width={"50%"}
          onPress={() => deleteLocationAlarm(item)}
        >
          Excluir
        </Button>
      </HStack>
    </Box>
  )
}