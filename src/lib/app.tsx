import { Context, createContext, useContext, useState } from 'react'
import { getAllDisciplinesApi, getAllQuizzesApi, getAllSubjectsByDisciplineApi } from '../services/api'
import { FilterQuiz } from '../services/db';

interface Quiz {
  id: string
  discipline: string
  subject: string
  title: string
  description?: string
  questions: [
    {
      type: string
      title: string
      options: [
        {
          optionId: string
          title: string
        }
      ]
      answer: string
      answerReason: string
    }
  ]
  user: any
  createdAt: string
  updatedAt: string
}

interface Discipline {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface IAppResource<T> {
  list: T[]
  loading: boolean
}

interface IAppContext {
  quizzes: IAppResource<Quiz>
  disciplines: IAppResource<Discipline>
  subjects: IAppResource<Subject>
  getQuizzes: (filter: FilterQuiz) => Promise<void>
  getDisciplines: () => Promise<void>
  getSubjectsByDiscipline: (disciplineId: string) => Promise<void>
}

const AppContext: Context<IAppContext> = createContext<IAppContext>({
  quizzes: {
    list: [],
    loading: false
  },
  disciplines: {
    list: [],
    loading: false
  },
  subjects: {
    list: [],
    loading: false
  },
  getQuizzes: async () => {},
  getDisciplines: async () => {},
  getSubjectsByDiscipline: async () => {}
});

function useProvideApp() {
  const [quizzes, setQuizzes] = useState<IAppResource<Quiz>>({ list: [], loading: false });
  const [disciplines, setDisciplines] = useState<IAppResource<Discipline>>({ list: [], loading: false });
  const [subjects, setSubjects] = useState<IAppResource<Subject>>({ list: [], loading: false });

  const getQuizzes = async (filter: FilterQuiz) => {
    setQuizzes(prev => ({ ...prev, loading: true }))
    let result: Quiz[];
    try {
      const { data } = await getAllQuizzesApi(filter)
      result = data.result
    } catch {
    } finally {
      setQuizzes(prev => ({ ...prev, list: result, loading: false }))
    }
  }

  const getSubjectsByDiscipline = async (disciplineId: string) => {
    setSubjects(prev => ({ ...prev, loading: true }))
    let result: Subject[];
    try {
      const { data } = await getAllSubjectsByDisciplineApi(disciplineId)
      result = data.result
    } catch {
    } finally {
      setSubjects(prev => ({ ...prev, list: result, loading: false }))
    }
  }

  const getDisciplines = async () => {
    setDisciplines(prev => ({ ...prev, loading: true }))
    let result: Discipline[];
    try {
      const { data } = await getAllDisciplinesApi()
      result = data.result
    } catch {
    } finally {
      setDisciplines(prev => ({ ...prev, list: result, loading: false }))
    }
  }

  return {
    quizzes,
    disciplines,
    subjects,
    getQuizzes,
    getDisciplines,
    getSubjectsByDiscipline
  }
}

export function AppProvider({ children }: any) {
  const app = useProvideApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

