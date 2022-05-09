import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Center, Container, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../lib/auth';

const signin = () => {
  const { t } = useTranslation('signin')
  const { auth, siginWithGoogle } = useAuth();
  const router = useRouter();

  if (auth) {
    router.push((router.query.next as string) || '/', (router.query.as as string) || '/');
  }

  return (
    <Container
      maxW="3xl"
      mt={5}
      p={6}
    >
      <VStack spacing="4">
        <Heading fontSize="3xl" mb={2}>
          {t('welcome')}
        </Heading>
        <Button size='lg' leftIcon={<FcGoogle />} onClick={() => siginWithGoogle()}>
          {t('signInWithGoogle')}
        </Button>
      </VStack>
    </Container>
  );
};

export default signin;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'signin', 'footer'])),
    },
  };
}
