import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, HStack, VStack } from 'native-base';
import { useWindowDimensions } from 'react-native';

export default function Config() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

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
          Configurações
        </Button>
      </HStack>

    </VStack>
  )
}
