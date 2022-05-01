export enum QuestionType {
  MULTICHOISE = 'multichoise',
  TRUE_OR_FALSE = 'trueorfalse'
}

export const questionTypes: Array<{ label: string, code: QuestionType }> = [
  {
    label: 'Multichoise',
    code: QuestionType.MULTICHOISE
  },
  {
    label: 'True or False',
    code: QuestionType.TRUE_OR_FALSE
  }
]

export const optionLabelsForQuestionType = {
  [QuestionType.MULTICHOISE]: [
    {
      code: 'A',
      title: '',
      answer: 0
    },
    {
      code: 'B',
      title: '',
      answer: 1
    },
    {
      code: 'C',
      title: '',
      answer: 2
    },
    {
      code: 'D',
      title: '',
      answer: 3
    },
  ],
  [QuestionType.TRUE_OR_FALSE]: [
    {
      code: 'true',
      title: 'True',
      answer: 0
    },
    {
      code: 'false',
      title: 'False',
      answer: 1
    },
  ]
}

export const getOptionsForQuestionType = (questionType: QuestionType) => {
  return optionLabelsForQuestionType[questionType]
}