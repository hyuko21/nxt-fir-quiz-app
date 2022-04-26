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
  Text,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { Field, FieldArray, Form, Formik, getIn } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import Navbar from '../../../common/Navbar';
import { useApp } from '../../../lib/app';
import { useAuth } from '../../../lib/auth';
import { addQuizApi } from '../../../services/api';
import { getOptionsForQuestionType, QuestionType, questionTypes } from '../../../utils/quiz';

const Index = () => {
  const { auth, loading } = useAuth();
  const { disciplines, subjects, getDisciplines, getSubjectsByDiscipline } = useApp();
  const [selectableDisciplines, setSelectableDisciplines] = useState([])
  const [selectableSubjects, setSelectableSubjects] = useState([])

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/signin?next=/quiz/new');
    }
  }, [auth, loading]);

  useEffect(() => {
    getDisciplines()
  }, [])

  useEffect(() => {
    if (disciplines.list.length && selectableDisciplines.length === 0) {
      setSelectableDisciplines(disciplines.list.map((item) => ({ label: item.name, value: item.id })))
    }
    if (subjects.list.length && selectableSubjects.length === 0) {
      setSelectableSubjects(subjects.list.map((item) => ({ label: item.name, value: item.id })))
    }
  }, [disciplines.list.length, subjects.list.length])

  const questionsData = {
    title: '',
    type: QuestionType.MULTICHOISE,
    options: getOptionsForQuestionType(QuestionType.MULTICHOISE),
    answer: 0,
  };

  const initialValues = {
    discipline: '',
    subject: '',
    title: '',
    description: '',
    questions: [questionsData],
  };

  const validationSchema = yup.object().shape({
    discipline: yup.string().required('Required'),
    subject: yup.string().required('Required'),
    title: yup.string().required('Required'),
    description: yup.string(),
    questions: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required('Required'),
          type: yup.string().oneOf(Object.values(QuestionType)).required('Required'),
          options: yup.array().of(
            yup.object().shape({
              title: yup.string().required('Required'),
            })
          ),
        })
      )
      .required('Must add a question'),
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
              return { title: option.title, optionId: uuidv4() };
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
    <>
      <Navbar />
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
          onSubmit={submitHandler}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
              <Field name="discipline">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isInvalid={form.errors.discipline && form.touched.discipline}
                    >
                      <FormLabel htmlFor="discipline" fontSize="xl" mb={-4}>
                        Quiz Discipline
                      </FormLabel>
                      <CUIAutoComplete
                        items={selectableDisciplines}
                        label=''
                        placeholder=''
                        hideToggleButton
                        renderCustomInput={(inputProps) => (
                          <Input
                            {...inputProps}
                            {...field}
                            onChange={(e) => { inputProps.onChange(e); field.onChange(e) }}
                            onBlur={(e) => { inputProps.onBlur(e); field.onBlur(e) }}
                            id='discipline'
                          />
                        )}
                        selectedItems={[]}
                        disableCreateItem
                        onSelectedItemsChange={(changes) => {
                          const nextSelected = changes.selectedItems[0]
                          form.setFieldValue('discipline', nextSelected?.label)
                          nextSelected && getSubjectsByDiscipline(nextSelected.value)
                        }}
                      />
                      <FormErrorMessage mt={-4}>{form.errors.discipline}</FormErrorMessage>
                    </FormControl>
                  )
                }}
              </Field>
              <Field name="subject">
                {({ field, form }) => {
                  return (
                    <FormControl
                      isInvalid={form.errors.subject && form.touched.subject}
                      isDisabled={!form.values.discipline}
                    >
                      <FormLabel htmlFor="subject" fontSize="xl" mt={4} mb={-4}>
                        Quiz Subject
                      </FormLabel>
                      <CUIAutoComplete
                        items={selectableSubjects}
                        label=''
                        placeholder=''
                        hideToggleButton
                        renderCustomInput={(inputProps) => (
                          <Input
                            {...inputProps}
                            {...field}
                            onChange={(e) => { inputProps.onChange(e); field.onChange(e) }}
                            onBlur={(e) => { inputProps.onBlur(e); field.onBlur(e) }}
                            id='subject'
                          />
                        )}
                        selectedItems={[]}
                        disableCreateItem
                        onSelectedItemsChange={(changes) => {
                          const nextSelected = changes.selectedItems[0]
                          form.setFieldValue('subject', nextSelected?.label)
                        }}
                      />
                      <FormErrorMessage mt={-4}>{form.errors.subject}</FormErrorMessage>
                    </FormControl>
                  )
                }}
              </Field>
              <Field name="title">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.title && form.touched.title}
                  >
                    <FormLabel htmlFor="title" fontSize="xl" mt={4}>
                      Quiz Title
                    </FormLabel>
                    <Input {...field} id="title" />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="description">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.description && form.touched.description
                    }
                  >
                    <FormLabel htmlFor="description" fontSize="xl" mt={4}>
                      Quiz description
                    </FormLabel>
                    <Textarea {...field} id="description" />
                    <FormErrorMessage>
                      {form.errors.description}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="questions">
                {({ field }) => (
                  <FormControl>
                    <FormLabel htmlFor="questions" fontSize="xl" mt={4}>
                      Enter your question data:
                    </FormLabel>
                    <Box ml={4}>
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
                                  <Flex key={index} direction="column">
                                    <FormControl
                                      isInvalid={errorHandler(
                                        `questions[${index}][title]`
                                      )}
                                    >
                                      <FormLabel
                                        htmlFor={`questions[${index}][title]`}
                                      >
                                        Question Title:
                                      </FormLabel>
                                      <Input
                                        name={`questions[${index}][title]`}
                                        as={Field}
                                        mb={
                                          !errorHandler(
                                            `questions[${index}][title]`
                                          ) && 3
                                        }
                                      />
                                      <FormErrorMessage>
                                        {errorHandler(
                                          `questions[${index}][title]`
                                        )}
                                      </FormErrorMessage>
                                    </FormControl>
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
                                            Question Type:
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
                                                {questionType.label}
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
                                              {option.label}
                                            </FormLabel>
                                            <Input
                                              name={`questions[${index}][options][${subIndex}].title`}
                                              as={Field}
                                            />
                                            <FormErrorMessage>
                                              {errorHandler(
                                                `questions[${index}][options][${subIndex}].title`
                                              )}
                                            </FormErrorMessage>
                                          </FormControl>
                                        ))}
                                      </SimpleGrid>
                                    )}
                                    <Box>
                                      <Text mb="8px">Correct Answer:</Text>
                                      <Field
                                        component="select"
                                        name={`questions[${index}][answer]`}
                                        style={{
                                          width: '100%',
                                          padding: '10px',
                                        }}
                                      >
                                        {_question.options.map((option, key) => (
                                          <option
                                            value={option.answer}
                                            key={key}
                                          >
                                            {option.code}
                                          </option>
                                        ))}
                                      </Field>
                                    </Box>
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
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                  disabled={!(props.isValid && props.dirty)}
                >
                  Submit Quiz
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Index;
