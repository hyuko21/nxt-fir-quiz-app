import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  RadioGroup,
  Text,
  Stack,
  Radio,
  Box
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { addAnswerApi, getAllQuizzesApi, safeApiCall } from '../../../services/api';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { QuestionType } from '../../../utils/quiz';
import { getSingleQuiz } from '../../../services/db';

const ShowAnswer = (answer) => {
  const { t } = useTranslation('quiz')

  if (!answer) return
  let Answer: () => React.ReactElement;
  if (answer.isCorrect) {
    Answer = () => (
      <Heading size='md' color='green.500'>{t('correctAnswer')}</Heading>
    )
  } else {
    Answer = () => (
      <>
        <Heading size='md' color='red.500'>{t('wrongAnswer')}</Heading>
        {answer.reason && <Text fontSize='lg'><b>{t('answerReason')}:</b> {answer.reason}</Text>}
      </>
    )
  }
  return (
    <Stack mt={8} spacing={2}><Answer /></Stack>
  )
}

const ShowQuiz = (quiz, answered, onSubmit, onAnswer) => {
  const { t } = useTranslation('quiz')

  return (
    <Container
      maxW="7xl"
      mt={5}
      p={6}
    >
      <Box mb={10}>
        <Flex alignItems='center' gap='8px' mb={8}>
          <Heading size='sm'>{quiz.discipline}</Heading>
          <ChevronRightIcon fontSize={24}/>
          <Heading size='sm'>{quiz.subject}</Heading>
        </Flex>
        <Center flexDirection="column">
          <Heading>{quiz.title}</Heading>
        </Center>
        <Text>{quiz.description}</Text>
      </Box>
      <Formik initialValues={{}} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            {quiz.questions.map((question, key) => {
              return (
                <Box
                  borderWidth='1px'
                  borderRadius='lg'
                  padding={6}
                  mt={10}
                  key={key}
                  backgroundColor={
                    answered[question.questionId] ? (
                      answered[question.questionId]?.isCorrect
                      ? 'green.100'
                      : 'red.100'
                    ) : 'whiteAlpha.100'
                  }
                >
                  <Field name={question.questionId}>
                    {({ field, form }) => (
                      <FormControl
                        isRequired={true}
                        mb={{ base: 4, md: 0 }}
                        isDisabled={answered[question.questionId]}
                      >
                        <Heading mt={4} size="md">{question.title}</Heading>
                        <Divider
                          mt={4}
                          mb={4}
                          css={{
                            boxShadow: '1px 1px #333'
                          }}
                        />
                        <RadioGroup
                          name={question.questionId}
                          onChange={(nextValue) => form.setFieldValue(question.questionId, nextValue)}
                        >
                          <Stack mb={2} spacing={2}>
                            {question.options.map((option, subkey) => {
                              const optionTitle = question.type === QuestionType.MULTICHOISE ? (
                                `${option.code}) ${option.title}`
                              ) : t(option.code)
                              return (
                                <HStack key={subkey}>
                                  <Radio
                                    {...field}
                                    name={question.questionId}
                                    value={option.optionId}
                                  />
                                  <Text fontSize="lg">{optionTitle}</Text>
                                </HStack>
                              )
                            })}
                          </Stack>
                        </RadioGroup>
                        <Button
                          isDisabled={!props.values[question.questionId] || answered[question.questionId]}
                          mt={4}
                          colorScheme="twitter"
                          onClick={() => onAnswer(question, props.values[question.questionId])}
                        >
                          {t('submitAnswer')}
                        </Button>
                        {ShowAnswer(answered[question.questionId])}
                      </FormControl>
                    )}
                  </Field>
                </Box>
              )
            })}
            {/* <Center mt={10}>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                isDisabled={answered.count < quiz.questions.length}
                colorScheme="green"
              >
                Submit
              </Button>
            </Center> */}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const SingleQuiz = (props) => {
  const { auth, loading } = useAuth();
  const [answered, setAnswered] = useState({ count: 0 });

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading && props.quizId) {
      router.push(`/signin?next=quiz/[id]&as=/quiz/${props.quizId}`, `/signin?next=quiz/${props.quizId}`);
    }
  }, [auth, loading]);

  const onSubmit = async (values, actions) => {
    try {
      const resp = await addAnswerApi(auth, props.quizId, values);
      const answerId = resp.data.data.answerId;
      router.push('/quiz/[id]/answer/[answerId]', `/quiz/${props.quizId}/answer/${answerId}`);
    } catch (error) {
      console.log('error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const onAnswer = (question, optionId: string) => {
    const selectedOptionIndex = question.options.findIndex((option) => option.optionId === optionId)
    const answer = {
      isCorrect: String(selectedOptionIndex) === question.answer,
      reason: question.answerReason
    }
    setAnswered(prev => ({ ...prev, [question.questionId]: answer, count: prev.count + 1 }))
  }

  return props.quiz && ShowQuiz(props.quiz, answered, onSubmit, onAnswer);
};

export default SingleQuiz;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps(context) {
  const quizId = context.params.id;
  const quizData = await getSingleQuiz(quizId);
  return {
    props: {
      quiz: quizData,
      quizId,
      ...(await serverSideTranslations(context.locale, ['common', 'footer', 'quiz'])),
    }
  };
}
