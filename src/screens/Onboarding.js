import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, FlatList, HStack, Image, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isOnboardingPassed, setIsOnboardingPassed] = useState("waiting")

  const slides = [
    {
      id: '1',
      image: require('../assets/onboarding/1.png'),
      title: 'Adicione localizações',
      subtitle: 'Adicione os localizações onde você anda frequentemente',
      show: false,
    },
    {
      id: '2',
      image: require('../assets/onboarding/2.png'),
      title: 'Ative os alarmes que deseja',
      subtitle: 'Ao se aproximar da àrea, conforme definida, irá tocar seu alarme.',
      show: false,
    },
    {
      id: '3',
      image: require('../assets/onboarding/3.png'),
      title: 'Personalize seus alarmes',
      subtitle: 'Personalize seu alarme da forma que achar melhor.',
      show: true,
    },
  ]

  async function handleLeaveOnboarding() {
    try {
      await AsyncStorage.setItem('@onboarding', 'true');
      setIsOnboardingPassed("passed")
      navigation.navigate('Home')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (isFocused) {
      const executeAsync = async () => {
        try {
          const value = await AsyncStorage.getItem('@onboarding')
          if (value !== null) {
            if (JSON.parse(value)) {
              setIsOnboardingPassed("passed")
              navigation.navigate('Home');
            }
          } else {
            setIsOnboardingPassed("no-passed")
          }
        } catch (e) {
          console.error(e)
        }
      }
      executeAsync();
    }
  }, [isFocused])


  if (isOnboardingPassed === 'waiting') {
    return (
      <HStack
        width={width}
        height={height}
        bgColor="black"
        justifyContent="center"
        alignItems={"center"}
        paddingHorizontal={24}
      >
        <ActivityIndicator color={"#FFF"} />
      </HStack>)
  }

  return (
    <FlatList
      pagingEnabled
      horizontal
      data={slides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VStack key={item.id}
          width={width}
          height={height}
          bgColor="black"
          justifyContent="center"
          alignItems={"center"}
          paddingHorizontal={24}
        >
          <Image
            source={item.image}
            alt={item.title}
            style={{
              width: width * 0.8,
              height: width * 0.8,
              borderRadius: 16,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              color: '#f0f2f5',
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#f0f2f5',
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {item.subtitle}
          </Text>

          {
            item.show && (
              <Button
                onPress={handleLeaveOnboarding}
                borderRadius={"full"}
                bgColor={"white"}
                _text={{ color: 'black', fontWeight: 'bold' }}
                rightIcon={<Feather name="arrow-right" size={24} style={{ marginLeft: 6 }} color="#000" />}
              >
                Vamos comecar?
              </Button>
            )
          }
        </VStack>
      )}
    />
  )
}
