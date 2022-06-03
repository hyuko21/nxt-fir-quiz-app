import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  SimpleGrid,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Select,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik, getIn } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { useAuth } from '../../../lib/auth';
import { addQuizApi } from '../../../services/api';
import { getOptionsForQuestionType, QuestionType, questionTypes } from '../../../utils/quiz';

const Index = () => {
  const { t } = useTranslation(['common', 'footer', 'validation', 'quiz'])
  const { auth, loading } = useAuth();
  // const { disciplines, subjects, getDisciplines, getSubjectsByDiscipline } = useApp();
  // const [selectableDisciplines, setSelectableDisciplines] = useState([])
  // const [selectableSubjects, setSelectableSubjects] = useState([])

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/signin?next=quiz/new');
    }
  }, [auth, loading]);

  // useEffect(() => {
  //   getDisciplines()
  // }, [])

  // useEffect(() => {
  //   if (disciplines.list.length) {
  //     setSelectableDisciplines(disciplines.list.map((item) => ({ label: item.name, value: item.id })))
  //   }
  //   if (subjects.list.length) {
  //     setSelectableSubjects(subjects.list.map((item) => ({ label: item.name, value: item.id })))
  //   }
  // }, [disciplines.list, subjects.list])

  const questionsData = {
    title: '',
    type: QuestionType.MULTICHOISE,
    options: getOptionsForQuestionType(QuestionType.MULTICHOISE),
    answer: '0',
    answerReason: ''
  };

  const initialValues = {
    discipline: '',
    subject: '',
    title: '',
    // description: '',
    questions: [questionsData],
  };

  const validationSchema = yup.object().shape({
    discipline: yup.string().required(t('required', { ns: 'validation' })),
    subject: yup.string().required(t('required', { ns: 'validation' })),
    title: yup.string().required(t('required', { ns: 'validation' })),
    // description: yup.string(),
    questions: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required(t('required', { ns: 'validation' })),
          type: yup.string().oneOf(Object.values(QuestionType)).required(t('required', { ns: 'validation' })),
          options: yup.array().of(
            yup.object().shape({
              title: yup.string().required(t('required', { ns: 'validation' })),
            })
          ),
          answer: yup.string().required(t('required', { ns: 'validation' }))
        })
      )
      .required(t('mustAddQuestion', { ns: 'validation' })),
  });

  const submitHandler = async (values, actions) => {
    try {
      values = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: values.questions.map((question) => {
          return {
            ...question,
            options: question.options.map((option) => {
              return { title: option.title, optionId: uuidv4(), code: option.code };
            }),
            questionId: uuidv4(),
          };
        }),
      };
      await addQuizApi(auth, values);
      router.push('/');
    } catch (error) {
      console.log('error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

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
        onSubmit={submitHandler}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            {/* <FieldAutoComplete
              id='discipline'
              name='discipline'
              label={t('discipline')}
              placeholder={t('selectDiscipline', { ns: 'quiz' })}
              items={selectableDisciplines}
              onSelect={(item) => {
                props.setFieldValue('discipline', item?.label)
                props.setFieldValue('subject', '')
                item && getSubjectsByDiscipline(item.value)
              }}
              shouldValidate
            />
            <FieldAutoComplete
              id='subject'
              name='subject'
              label={t('subject')}
              placeholder={t('selectSubject', { ns: 'quiz' })}
              items={selectableSubjects}
              onSelect={(item) => {
                props.setFieldValue('subject', item?.label)
              }}
              isDisabled={!props.values.discipline}
              shouldValidate
            /> */}
            <Field name="discipline">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.discipline && form.touched.discipline}
                >
                  <FormLabel htmlFor="discipline" fontSize="xl" mt={4}>
                    {t('discipline')}
                  </FormLabel>
                  <Input {...field} id="discipline" />
                  <FormErrorMessage>{form.errors.discipline}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="subject">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.subject && form.touched.subject}
                >
                  <FormLabel htmlFor="subject" fontSize="xl" mt={4}>
                    {t('subject')}
                  </FormLabel>
                  <Input {...field} id="subject" />
                  <FormErrorMessage>{form.errors.subject}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="title">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.title && form.touched.title}
                >
                  <FormLabel htmlFor="title" fontSize="xl" mt={4}>
                    {t('title', { ns: 'quiz' })}
                  </FormLabel>
                  <Input {...field} id="title" />
                  <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {/* <Field name="description">
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.description && form.touched.description
                  }
                >
                  <FormLabel htmlFor="description" fontSize="xl" mt={4}>
                    {t('description', { ns: 'quiz' })}
                  </FormLabel>
                  <Textarea {...field} id="description" />
                  <FormErrorMessage>
                    {form.errors.description}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field> */}
            <Field name="questions">
              {({ field }) => (
                <FormControl>
                  <FormLabel htmlFor="questions" fontSize="xl" mt={4}>
                    {t('questionData', { ns: 'quiz' })}
                  </FormLabel>
                  <Box ml={4}>
                    {/* @ts-ignore */}
                    <FieldArray {...field} name="questions" id="questions">
                      {(fieldArrayProps) => {
                        const { push, remove, form } = fieldArrayProps;
                        const { values, errors, touched, setFieldValue } = form;
                        const { questions } = values;
                        const errorHandler = (name) => {
                          const error = getIn(errors, name);
                          const touch = getIn(touched, name);
                          return touch && error ? error : null;
                        };
                        return (
                          <div>
                            {questions.map((_question, index) => {
                              return (
                                <Flex key={index} direction="column" gap={3}>
                                  <Field name={`questions[${index}][title]`}>
                                    {({ field: questionTitleField }) => (
                                      <FormControl
                                        isInvalid={errorHandler(
                                          `questions[${index}][title]`
                                        )}
                                      >
                                        <FormLabel
                                          htmlFor={`questions[${index}][title]`}
                                        >
                                          {t('questionTitle', { ns: 'quiz' })}
                                        </FormLabel>
                                        <Textarea {...questionTitleField} id={`questions[${index}][title]`} />
                                        <FormErrorMessage>
                                          {errorHandler(
                                            `questions[${index}][title]`
                                          )}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                  <Field name={`questions[${index}][type]`}>
                                    {({ field: questionTypeField }) => (
                                      <FormControl
                                        isInvalid={errorHandler(
                                          `questions[${index}][type]`
                                        )}
                                      >
                                        <FormLabel
                                          htmlFor={`questions[${index}][type]`}
                                        >
                                          {t('questionType', { ns: 'quiz' })}
                                        </FormLabel>
                                        <RadioGroup
                                          defaultValue={_question.type}
                                          onChange={(nextValue: QuestionType) => {
                                            setFieldValue(`questions[${index}][options]`, getOptionsForQuestionType(nextValue))
                                          }}
                                          mb={
                                            !errorHandler(
                                              `questions[${index}][type]`
                                            ) && 3
                                          }
                                        >
                                          <Stack direction='row'>
                                          {questionTypes.map((questionType, key) => (
                                            <Radio
                                              {...questionTypeField}
                                              name={`questions[${index}][type]`}
                                              value={questionType.code}
                                              key={key}
                                            >
                                              {t(`${questionType.code}Type`, { ns: 'quiz' })}
                                            </Radio>
                                          ))}
                                          </Stack>
                                        </RadioGroup>
                                        <FormErrorMessage>
                                          {errorHandler(
                                            `questions[${index}][type]`
                                          )}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                  {_question.type === QuestionType.MULTICHOISE && (
                                    <SimpleGrid
                                      minChildWidth="300px"
                                      spacing="10px"
                                      mb={{ base: 4 }}
                                    >
                                      {_question.options.map((option, subIndex) => (
                                        <Field key={subIndex} name={`questions[${index}][options][${subIndex}].title`}>
                                          {({ field: questionOptionField }) => (
                                            <FormControl
                                              mb={2}
                                              key={subIndex}
                                              isInvalid={errorHandler(
                                                `questions[${index}][options][${subIndex}].title`
                                              )}
                                            >
                                              <FormLabel
                                                htmlFor={`questions[${index}][options][${subIndex}].title`}
                                              >
                                                {t('optionLabel', { ns: 'quiz', val: option.code })}:
                                              </FormLabel>
                                              <Input
                                                {...questionOptionField}
                                                id={`questions[${index}][options][${subIndex}].title`}
                                              />
                                              <FormErrorMessage>
                                                {errorHandler(
                                                  `questions[${index}][options][${subIndex}].title`
                                                )}
                                              </FormErrorMessage>
                                            </FormControl>
                                          )}
                                        </Field>
                                      ))}
                                    </SimpleGrid>
                                  )}
                                  <Field name={`questions[${index}][answer]`}>
                                    {({ field: questionAnswerField }) => (
                                      <FormControl
                                        isInvalid={errorHandler(
                                          `questions[${index}][answer]`
                                        )}
                                        mb={{ base: 4 }}
                                      >
                                        <FormLabel
                                          htmlFor={`questions[${index}][answer]`}
                                        >
                                          {t('answerLabel', { ns: 'quiz' })}
                                        </FormLabel>
                                        <Select
                                          {...questionAnswerField}
                                          mb={
                                            !errorHandler(
                                              `questions[${index}][answer]`
                                            ) && 3
                                          }
                                        >
                                          {_question.options.map((option, key) => (
                                            <option
                                              value={option.answer}
                                              key={key}
                                            >
                                              {t('optionLabel', { ns: 'quiz', val: `[${t(option.code, { ns: 'quiz' })}]` })}
                                            </option>
                                          ))}
                                        </Select>
                                        <FormErrorMessage>
                                          {errorHandler(
                                            `questions[${index}][answer]`
                                          )}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                  <Field name={`questions[${index}][answerReason]`}>
                                    {({ field: questionAnswerReasonField }) => (
                                      <FormControl>
                                        <FormLabel htmlFor={`questions[${index}][answerReason]`}>
                                          {t('answerReason', { ns: 'quiz' })}
                                        </FormLabel>
                                        <Textarea {...questionAnswerReasonField} id={`questions[${index}][answerReason]`} />
                                      </FormControl>
                                    )}
                                  </Field>
                                  <Flex
                                    direction="row"
                                    justify="flex-end"
                                    mt={4}
                                  >
                                    {index > 0 && (
                                      <IconButton
                                        onClick={() => remove(index)}
                                        aria-label="Remove Question"
                                        icon={<MinusIcon />}
                                        variant="ghost"
                                      >
                                        -
                                      </IconButton>
                                    )}
                                    {index === questions.length - 1 && (
                                      <IconButton
                                        onClick={() => push(questionsData)}
                                        aria-label="Add Question"
                                        icon={<AddIcon />}
                                        variant="ghost"
                                      >
                                        +
                                      </IconButton>
                                    )}
                                  </Flex>
                                  {index !== questions.length - 1 && (
                                    <Divider
                                      mt={2}
                                      mb={4}
                                      css={{
                                        boxShadow: '1px 1px #888888',
                                      }}
                                    />
                                  )}
                                </Flex>
                              );
                            })}
                          </div>
                        );
                      }}
                    </FieldArray>
                  </Box>
                </FormControl>
              )}
            </Field>
            <Center>
              <Button
                colorScheme="whatsapp"
                isLoading={props.isSubmitting}
                type="submit"
                disabled={!(props.isValid && props.dirty)}
              >
                {t('submitQuiz', { ns: 'quiz' })}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Index;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer', 'validation', 'quiz'])),
    },
  };
}
