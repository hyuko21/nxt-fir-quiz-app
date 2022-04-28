import { Box, Container, Divider, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useApp } from '../lib/app';

const Home = () => {
  const { quizzes, getQuizzes } = useApp();
  const router = useRouter();

  useEffect(() => {
    getQuizzes({})
  }, [])

  const generateQuizCard = (singleQuiz) => {
    return (
      <Box m={3} borderWidth="1px" borderRadius="lg" p={6} boxShadow="xl">
        <Heading as="h3" size="lg">
          {singleQuiz.title}
        </Heading>
      
          <Text color="gray.500" mt={2}>
            Posted By: {singleQuiz.user.name}
          </Text>
          <Text color="gray.500" mt={2}>
            No of Questions: {singleQuiz.questions.length}
          </Text>
   
        <Divider mt={3} mb={3} />
        <Text noOfLines={[1, 2, 3]}>{singleQuiz.description}</Text>
      </Box>
    );
  };

  const { list } = quizzes;

  return (
    <Box>
      <Head>
        <title>QuizApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header>
          <Container maxW="6xl">
            {list.length > 0 && (
              <SimpleGrid minChildWidth="400px">
                {list.map((singleQuiz) => (
                  <Box
                    key={singleQuiz.id}
                    onClick={() => router.push(`/quiz/${singleQuiz.id}`)}
                    as="button"
                    textAlign="start"
                    m={2}
                  >
                    {generateQuizCard(singleQuiz)}
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Container>
        </header>
      </main>
      <footer></footer>
    </Box>
  );
};

export default Home;
