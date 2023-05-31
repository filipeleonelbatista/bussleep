import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { Button, FormControl, HStack, Input, Slider, VStack, WarningOutlineIcon } from 'native-base';
import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import * as Yup from 'yup';
import { useLocations } from '../hooks/useLocations';

import Mapbox from '@rnmapbox/maps';
import circle from '@turf/circle';

Mapbox.setAccessToken('pk.eyJ1IjoiZmlsaXBlbGVvbmVsYmF0aXN0YSIsImEiOiJjbDA5dWF5YXIwZ3oxM2tudDhsajBoY3M4In0.RYxLDG-hEGzrglaAPykBxw');

var options = { steps: 100, units: 'kilometers', properties: { foo: 'bar' } };

export default function AddLocation() {
  const { currentLocation, addLocationAlarm } = useLocations();

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      destination: Yup.string().required("O campo Destino é obrigatório"),
      position: Yup.object().shape({
        latitude: Yup.number().required(),
        longitude: Yup.number().required()
      }),
      ratio: Yup.number(),
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      destination: '',
      position: { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
      ratio: 40,
    },
    validationSchema: formSchema,
    onSubmit: values => {
      handleSubmitForm(values)
    },
  });

  async function handleSubmitForm(formValues) {
    const data = {
      destination: formValues.destination,
      position: formValues.position,
      ratio: formValues.ratio,
    }

    addLocationAlarm(data)

    navigation.navigate("Home")
  }

  return (
    <VStack
      width={'100%'}
      height={height}
      position={"relative"}
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
          onPress={() => navigation.navigate("Home")}
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
          Adicionar localização
        </Button>
      </HStack>

      <VStack paddingHorizontal={24} paddingVertical={8} marginBottom={6}>
        <FormControl isInvalid={!!formik.errors.destination} w="100%">
          <FormControl.Label>Destino</FormControl.Label>
          <Input
            placeholder="Digite o nome deste alarme"
            value={formik.values.destination}
            onChangeText={(text) => formik.setFieldValue('destination', text)}
          />
          {!!formik.errors.destination && (
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {formik.errors.destination}
            </FormControl.ErrorMessage>
          )}
        </FormControl>

        <VStack space={4} w="100%" h={60} px={4}>
          <FormControl isInvalid={!!formik.errors.ratio} >
            <FormControl.Label>Selecione um raio de area para o alarme</FormControl.Label>
            <Slider
              minValue={10}
              maxValue={2000}
              defaultValue={10}
              accessibilityLabel="Selecione um raio de area para o alarme"
              onChangeEnd={(v) => formik.setFieldValue('ratio', v)}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
            {!!formik.errors.ratio && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {formik.errors.ratio}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </VStack>

        <VStack space={4} w="100%">
          <FormControl isInvalid={!!formik.errors.position} alignItems={"center"}>
            <FormControl.Label>Mova o mapa para a area que deseja selecionar</FormControl.Label>
            {!!formik.errors.position && (
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {formik.errors.position}
              </FormControl.ErrorMessage>
            )}

            <Mapbox.MapView
              id="map"
              scaleBarEnabled={false}
              style={{
                width: width * 0.88,
                height: width * 0.83,
              }}
              styleURL={Mapbox.StyleURL.Street}
              onMapIdle={(region) => {
                formik.setFieldValue("position", { latitude: region.properties.center[1], longitude: region.properties.center[0] })
              }}
            >
              <Mapbox.Camera
                animationMode="flyTo"
                animationDuration={2000}
                zoomLevel={14}
                centerCoordinate={[formik.values.position.longitude, formik.values.position.latitude]}
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
                id="selected_location"
                title="Your location"
                aboveLayerID="routeSource"
                coordinate={[formik.values.position.longitude, formik.values.position.latitude]}
              />
              <Mapbox.ShapeSource
                id='routeSource'
                shape={
                  circle([formik.values.position.longitude, formik.values.position.latitude], formik.values.ratio / 1000, options)
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

          </FormControl>
        </VStack>

        <Button
          marginY={4}
          size={"lg"}
          _pressed={{ bg: 'gray.900' }}
          bgColor={"black"}
          _text={{
            color: "white",
            fontSize: 16,
          }}
          leftIcon={
            <Feather name="save" size={24} color="#FFF" />
          }
          onPress={formik.submitForm}
        >
          Salvar
        </Button>
      </VStack>

    </VStack>
  )
}
