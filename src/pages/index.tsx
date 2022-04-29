import { Box, Button, Container, Divider, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AutoCompleteInput } from '../common/AutoCompleteInput';
import { useApp } from '../lib/app';
import { FilterQuiz } from '../services/db';

const ShowFilter = () => {
  const [selectableDisciplines, setSelectableDisciplines] = useState([])
  const [selectableSubjects, setSelectableSubjects] = useState([])
  const [filter, setFilter] = useState<FilterQuiz>(null)
  const {
    disciplines,
    getDisciplines,
    getQuizzes,
    subjects,
    getSubjectsByDiscipline
  } = useApp();

  useEffect(() => {
    getDisciplines()
  }, [])

  useEffect(() => {
    getQuizzes(filter)
  }, [filter])

  useEffect(() => {
    if (disciplines.list.length) {
      setSelectableDisciplines(disciplines.list.map((item) => ({ label: item.name, value: item.id })))
    }
    if (subjects.list.length) {
      setSelectableSubjects(subjects.list.map((item) => ({ label: item.name, value: item.id })))
    }
  }, [disciplines.list, subjects.list])

  const initialValues = { discipline: '', subject: '' }

  return (
    <Container
      maxW="3xl"
      mt={5}
      mb={5}
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="xl"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={null}
      >
        {({ setFieldValue, values, resetForm }) => (
          <Form>
            <AutoCompleteInput
              id='discipline'
              name='discipline'
              label='Quiz Discipline'
              placeholder='Filter by Discipline'
              items={selectableDisciplines}
              onSelect={(item) => {
                setFieldValue('discipline', item?.label)
                setFieldValue('subject', '')
                item && getSubjectsByDiscipline(item.value)
              }}
            />
            <AutoCompleteInput
              id='subject'
              name='subject'
              label='Quiz Subject'
              placeholder='Filter by Subject'
              items={selectableSubjects}
              isDisabled={!values.discipline}
              onSelect={(item) => {
                setFieldValue('subject', item?.label)
              }}
            />
            <Flex justifyContent='flex-end' gap='12px'>
              {filter && (
                <Button
                  mt={4}
                  colorScheme="gray"
                  onClick={() => {
                    setFilter(null)
                    resetForm()
                  }}
                >
                  Reset Filter
                </Button>
              )}
              <Button
                isDisabled={!values.discipline || !values.subject}
                mt={4}
                colorScheme="twitter"
                onClick={() => {
                  setFilter({
                    disciplineName: values.discipline,
                    subjectName: values.subject
                  })
                }}
              >
                Search Quiz
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

const Home = () => {
  const { quizzes, getQuizzes } = useApp();
  const router = useRouter();

  useEffect(() => {
    getQuizzes({})
  }, [])

  const generateQuizCard = ({ title, discipline, subject, user, questions, description }: any) => {
    return (
      <Box m={3} borderWidth="1px" borderRadius="lg" p={6} boxShadow="xl">
        <Heading as="h3" size="lg">
          {title}
        </Heading>
      
        <Text color="gray.500" mt={2}>
          {discipline}, {subject}
        </Text>
        <Text color="gray.500" mt={2}>
          Posted By: {user.name}
        </Text>
        <Text color="gray.500" mt={2}>
          No of Questions: {questions.length}
        </Text>
   
        {description && (
          <>
            <Divider mt={3} mb={3} />
            <Text noOfLines={[1, 2, 3]}>{description}</Text>
          </>
        )}
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
        <Container maxW="6xl">
          <ShowFilter />
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
      </main>
    </Box>
  );
};

export default Home;
