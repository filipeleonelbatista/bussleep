import { Image, Text, VStack } from 'native-base';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import emptyImage from '../assets/location.png';

export default function EmptyMessage() {
  const { width } = useWindowDimensions();

  return (
    <VStack
      width={"100%"}
      mt={16}
      alignItems={"center"}
      justifyContent={"center"}
      space={4}
    >
      <Image alt="no data" source={emptyImage} style={{ width: width * 0.6, height: width * 0.6 }} />
      <Text
        textAlign={"center"}
        fontSize={20}
        bold
      >
        Toque em '+' para{'\n'}adicionar itens à tabela!
      </Text>
    </VStack>
  )
}