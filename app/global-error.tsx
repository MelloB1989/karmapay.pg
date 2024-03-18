'use client'
import { Providers } from '@/provider'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack
} from '@chakra-ui/react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Providers>
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{  md: '6xl' }}
          lineHeight={'110%'} color={'green.400'}>
         <br />
          <Text as={'span'} color={'orange.400'}>
          It feels like you have lost your way.
          </Text><br />
        </Heading>
        <Text color={'gray.500'}>
        KarmaPay is an open-source project that aims to simplify online payments by providing a unified API endpoint for multiple payment gateways. It abstracts the complexities of integration, allowing developers to seamlessly work with various payment providers while maintaining a single, consistent interface.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}>
          <Button
            colorScheme={'green'}
            bg={'green.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'green.500',
            }}
            onClick={() => reset()}
            >
            Get back
          </Button>
        </Stack>
      </Stack>
    </Container>
  </Providers>
  )
}