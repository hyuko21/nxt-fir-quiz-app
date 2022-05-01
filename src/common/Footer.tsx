import { useTranslation } from 'next-i18next'
import { Container, HStack, Text, Link, Stack } from '@chakra-ui/react'
import { FaHeart } from 'react-icons/fa';

export const Footer = () => {
  const { t } = useTranslation(['common', 'footer'])

  const Credits = () => (
    <HStack>
      <Text>&copy; {t('appName')}.</Text>
      <Text>{t('madeWith', { ns: 'footer' })}</Text>
      <FaHeart />
      <Text>{t('by', { ns: 'footer' })} <Link href={'https://github.com/hyuko21'} target='_blank'>hyuko21</Link></Text>
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