import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box, Button, Container, Divider, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FieldAutoComplete } from '../common/FieldAutoComplete';
import { useApp } from '../lib/app';
import { FilterQuiz } from '../services/db';

const ShowFilter = () => {
  const { t } = useTranslation(['common', 'home'])
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
      boxShadow="md"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={null}
      >
        {({ setFieldValue, values, resetForm }) => (
          <Form>
            <FieldAutoComplete
              id='discipline'
              name='discipline'
              label={t('discipline')}
              placeholder={t('filterDiscipline', { ns: 'home' })}
              items={selectableDisciplines}
              onSelect={(item) => {
                setFieldValue('discipline', item?.label)
                setFieldValue('subject', '')
                item && getSubjectsByDiscipline(item.value)
              }}
            />
            <FieldAutoComplete
              id='subject'
              name='subject'
              label={t('subject')}
              placeholder={t('filterSubject', { ns: 'home' })}
              items={selectableSubjects}
              isDisabled={false}
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
                  {t('cleanFilter', { ns: 'home' })}
                </Button>
              )}
              <Button
                isDisabled={!values.discipline || !values.subject}
                mt={4}
                colorScheme="twitter"
                onClick={() => {
                  setFilter({
                    discipline: values.discipline,
                    subject: values.subject
                  })
                }}
              >
                {t('searchQuiz', { ns: 'home' })}
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

const Home = () => {
  const { t } = useTranslation('home')
  const { quizzes, getQuizzes } = useApp();
  const router = useRouter();

  useEffect(() => {
    getQuizzes({})
  }, [])

  const generateQuizCard = ({ title, discipline, subject, user, questions, description }: any) => {
    return (
      <Box m={3} borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
        <Heading as="h3" size="md">
          {title}
        </Heading>
      
        <Text color="gray.500" mt={2}>
          {discipline}, {subject}
        </Text>
        <Text color="gray.500" mt={2}>
          {t('postedBy')} {user?.name}
        </Text>
        <Text color="gray.500" mt={2}>
          {t('questionQty')}: {questions.length}
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
    <Container maxW="6xl">
      <ShowFilter />
      {list.length > 0 && (
        <SimpleGrid minChildWidth="400px">
          {list.map((singleQuiz) => (
            <Box
              key={singleQuiz.id}
              onClick={() => router.push('quiz/[id]', `quiz/${singleQuiz.id}`)}
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
  );
};

export default Home;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home', 'footer'])),
    },
  };
}
