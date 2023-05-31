import { useNavigation } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import circle from '@turf/circle';
import { Box, Button, HStack, Text } from 'native-base';
import { useMemo } from 'react';
import { useLocations } from '../hooks/useLocations';

Mapbox.setAccessToken('pk.eyJ1IjoiZmlsaXBlbGVvbmVsYmF0aXN0YSIsImEiOiJjbDA5dWF5YXIwZ3oxM2tudDhsajBoY3M4In0.RYxLDG-hEGzrglaAPykBxw');

var options = { steps: 100, units: 'kilometers', properties: { foo: 'bar' } };

export default function AlarmItem({ item, ...props }) {

  const desiredZoom = useMemo(() => {
    const dist = item.ratio / 1000
    let zoomLevel;

    if (dist <= 1) {
      zoomLevel = 14; // Zoom de nível 15 para distâncias menores ou iguais a 1 km
    } else if (dist <= 2) {
      zoomLevel = 13; // Zoom de nível 12 para distâncias entre 1 e 2 km
    } else if (dist <= 5) {
      zoomLevel = 11; // Zoom de nível 12 para distâncias entre 2 e 5 km
    } else {
      zoomLevel = 10; // Zoom de nível 10 para distâncias maiores que 5 km
    }

    return zoomLevel;
  }, [item.ratio])

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
        {
          item?.position !== null && (
            <Mapbox.MapView
              id="map"
              scaleBarEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              logoEnabled={false}
              style={{
                width: '100%',
                height: 130,
              }}
              styleURL={Mapbox.StyleURL.Street}
            >
              <Mapbox.Camera
                animationMode="flyTo"
                animationDuration={2000}
                zoomLevel={desiredZoom}
                centerCoordinate={[item?.position?.longitude, item?.position?.latitude]}
              />
              <Mapbox.PointAnnotation
                id="my_location"
                title="Your location"
                aboveLayerID="routeSource"
                coordinate={[item?.position?.longitude, item?.position?.latitude]}
              />
              <Mapbox.ShapeSource
                id='routeSource'
                shape={
                  circle([item?.position?.longitude, item?.position?.latitude], item.ratio / 1000, options)
                }
                aboveLayerID="radiusOutline"
                belowLayerID="my_location"
                
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
          )
        }
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