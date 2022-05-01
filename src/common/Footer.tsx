import { Container, HStack, Text, Link, Stack } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa';

export const Footer = () => {
  const Credits = () => (
    <HStack>
      <Text>&copy; QuizApp.</Text>
      <Text>Made with</Text>
      <FaHeart />
      <Text>by <Link href={'https://github.com/hyuko21'} target='_blank'>hyuko21</Link></Text>
    </HStack>
  )

  const AppInfo = () => (
    <HStack>
    </HStack>
  )

  return (
    <Container
      alignSelf={'flex-end'}
      as="footer"
      role="contentinfo"
      maxW='6xl'
      mt={{ base: '12', md: '16' }}
      py={{ base: '12', md: '16' }}
      backgroundColor={'gray.50'}
      borderTopRadius={'lg'}
    >
      <Stack alignItems='center' justifyContent='center'>
        <AppInfo />
        <Credits />
      </Stack>
    </Container>
  )
}