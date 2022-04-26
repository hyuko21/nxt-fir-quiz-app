import { Context, createContext, useContext, useState } from 'react'
import { getAllDisciplinesApi, getAllSubjectsByDisciplineApi } from '../services/api'

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
  disciplines: IAppResource<Discipline>
  subjects: IAppResource<Subject>
  getDisciplines: () => Promise<void>
  getSubjectsByDiscipline: (disciplineId: string) => Promise<void>
}

const AppContext: Context<IAppContext> = createContext<IAppContext>({
  disciplines: {
    list: [],
    loading: false
  },
  subjects: {
    list: [],
    loading: false
  },
  getDisciplines: async () => {},
  getSubjectsByDiscipline: async () => {}
});

function useProvideApp() {
  const [disciplines, setDisciplines] = useState<IAppResource<Discipline>>({ list: [], loading: false });
  const [subjects, setSubjects] = useState<IAppResource<Subject>>({ list: [], loading: false });

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
    disciplines,
    subjects,
    getDisciplines,
    getSubjectsByDiscipline
  }
}

export function AppProvider({ children }: any) {
  const app = useProvideApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
