import { useTranslation } from 'next-i18next'
import { Box, Button, Divider, Flex, Heading, HStack, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../lib/auth';

const Navbar: React.FC<{}> = () => {
  const { t } = useTranslation()
  const { auth, signOut } = useAuth();
  const router = useRouter();

  return (
    <Box as='nav'>
      <Flex justify="space-between" m={4} alignItems={'flex-start'}>
        <Heading onClick={() => router.push('/')} as="button">
          {t('appName')}
        </Heading>
        <HStack p={2} gap='8px'>
          <Button
            p={2}
            isDisabled={router.pathname === '/quiz/new'}
            colorScheme='gray'
            onClick={() => router.push('/quiz/new')}
          >
            {t('addQuiz')}
          </Button>
          {auth ? (
            <Link p={2} onClick={() => signOut()}>
              {t('signOut')}
            </Link>
          ) : (
            <Link
              p={2}
              onClick={() => router.push('/signin')}
              fontWeight={
                router.pathname === '/signin' ? 'extrabold' : 'normal'
              }
            >
              {t('signIn')}
            </Link>
          )}
        </HStack>
      </Flex>
      <Divider css={{ boxShadow: '1px 1px #888' }} />
    </Box>
  );
};

export default Navbar;
