import { Box, Divider, Flex, Heading, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../lib/auth';

const Navbar: React.FC<{}> = () => {
  const { auth, signOut } = useAuth();
  const router = useRouter();

  return (
    <Box as='nav'>
      <Flex justify="space-between" m={4} alignItems={'flex-start'}>
        <Heading onClick={() => router.push('/')} as="button">
          QuizApp
        </Heading>
        <Box p={2}>
          <Link
            p={2}
            fontWeight={
              router.pathname === '/quiz/new' ? 'extrabold' : 'normal'
            }
            onClick={() => router.push('/quiz/new')}
          >
            Add new quiz
          </Link>
          {auth ? (
            <Link p={2} onClick={() => signOut()}>
              Logout
            </Link>
          ) : (
            <Link
              p={2}
              onClick={() => router.push('/signin')}
              fontWeight={
                router.pathname === '/signin' ? 'extrabold' : 'normal'
              }
            >
              Sign In
            </Link>
          )}
        </Box>
      </Flex>
      <Divider css={{ boxShadow: '1px 1px #888' }} />
    </Box>
  );
};

export default Navbar;
