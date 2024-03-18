"use client"
import {
    Box,
    Center,
    Text,
    Stack,
    List,
    ListItem,
    ListIcon,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react';

export default function Popup({url, change_status, amount}){
    //change_status();
    //window.open(url, '_blank');
    return(
        <Center py={6}>
      <Box
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        <Stack
          textAlign={'center'}
          p={6}
          color={useColorModeValue('gray.800', 'white')}
          align={'center'}>
          <Text
            fontSize={'sm'}
            fontWeight={500}
            bg={useColorModeValue('green.50', 'green.900')}
            p={2}
            px={3}
            color={'green.500'}
            rounded={'full'}>
            KarmaPay Payments
          </Text>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <Text fontSize={'3xl'}>INR</Text>
            <Text fontSize={'6xl'} fontWeight={800}>
              {amount}
            </Text>
            <Text color={'gray.500'}>-/</Text>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>

          <Button
            mt={10}
            w={'full'}
            bg={'green.400'}
            color={'white'}
            rounded={'xl'}
            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
            _hover={{
              bg: 'green.500',
            }}
            _focus={{
              bg: 'green.500',
            }}
            onClick={() => {
                const newWindow = window.open(url, '_blank');
                const checkWindowClosed = setInterval(() => {
                    if(newWindow.closed) {
                        change_status();
                        clearInterval(checkWindowClosed);
                    }
                }, 500);
            }}
            >
            Pay now
          </Button>
        </Box>
      </Box>
    </Center>
    )
}