import { Avatar, Box, Button, HStack, IconButton, ScrollView, Text, VStack } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import EmptyMessage from '../components/EmptyMessage';
import { useNavigation } from '@react-navigation/native';
import { useLocations } from '../hooks/useLocations';
import AlarmItem from '../components/AlarmItem';

export default function Home() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { LocationsList } = useLocations();

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
        {
          console.log("LocationsList", LocationsList)
        }

        {
          LocationsList.length === 0 ? <EmptyMessage /> : (
            LocationsList.map((item, index) => (<AlarmItem key={index} item={item} />))
          )
        }


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
