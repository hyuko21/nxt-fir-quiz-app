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
      label: 'Option A:',
      code: 'Option A',
      title: '',
      answer: 0
    },
    {
      label: 'Option B:',
      code: 'Option B',
      title: '',
      answer: 1
    },
    {
      label: 'Option C:',
      code: 'Option C',
      title: '',
      answer: 2
    },
    {
      label: 'Option D:',
      code: 'Option D',
      title: '',
      answer: 3
    },
  ],
  [QuestionType.TRUE_OR_FALSE]: [
    {
      code: 'True',
      title: 'True',
      answer: 0
    },
    {
      code: 'False',
      title: 'False',
      answer: 1
    },
  ]
}

export const getOptionsForQuestionType = (questionType: QuestionType) => {
  return optionLabelsForQuestionType[questionType]
}