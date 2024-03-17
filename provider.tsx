'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>
    {children}
    <ColorModeScript initialColorMode="dark"/>
    </ChakraProvider>
}