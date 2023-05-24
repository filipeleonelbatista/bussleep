import { Avatar, Box, Button, HStack, IconButton, ScrollView, Text, VStack } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import EmptyMessage from '../components/EmptyMessage';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <VStack
      width={'100%'}
      height={"100%"}
      position={"relative"}
    >
      <HStack
        width={'100%'}
        bgColor="black"
        alignItems="center"
        justifyContent={"space-between"}
        paddingHorizontal={24}
        paddingVertical={20}
        space={4}
      >
        <Avatar bg="white" size="lg" >
          <Feather name="user" size={38} color={"#000"} />
        </Avatar>
        <VStack>
          <Text fontSize={24} bold color="white">Olá 👋</Text>
          <Text fontSize={20} color="white">Para onde vamos hoje?</Text>
        </VStack>
        <IconButton
          icon={<Feather name="settings" size={20} color="#FFF" />}
          size={"md"}
          _pressed={{ bg: 'gray.900' }}
          borderRadius={"full"}
          onPress={() => navigation.navigate('Config')}
        />
      </HStack>
      <ScrollView
        paddingHorizontal={16}
        paddingVertical={16}
      >
        {/* <EmptyMessage /> */}
        <Box
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
          ></Box>
          <HStack>
            <Button
              _pressed={{ bg: 'green.600' }}
              _text={{ fontSize: 18, color: 'green.500' }}
              variant={"outline"}
              width={"50%"}>
              Ativar
            </Button>
            <Button
              _pressed={{ bg: 'red.600' }}
              _text={{ fontSize: 18, color: 'red.400' }}
              variant={"outline"}
              width={"50%"}>
              Excluir
            </Button>
          </HStack>
        </Box>

      </ScrollView>
      <Button
        position={"absolute"}
        bottom={4}
        right={4}
        bgColor={"black"}
        width={16}
        height={16}
        borderRadius={"full"}
        shadow={6}
        _pressed={{ bg: 'gray.900' }}
        onPress={() => navigation.navigate("AddLocation")}
      >
        <Feather name="plus" size={28} color="#FFF" />
      </Button>
    </VStack>
  )
}
