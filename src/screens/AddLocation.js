import { Avatar, Box, Button, HStack, ScrollView, Text, VStack } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import EmptyMessage from '../components/EmptyMessage';
import { useNavigation } from '@react-navigation/native';

export default function AddLocation() {
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
          Adicionar localização
        </Button>
      </HStack>

    </VStack>
  )
}
