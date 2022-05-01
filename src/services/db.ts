import firebase from '../lib/firebase';
import disciplines from '../data/disciplines.json'
import subjects from '../data/subjects.json'

export type FilterUser = {
  ids?: string[]
}

export type FilterQuiz = {
  discipline?: string
  subject?: string
}

export const addUser = async (authUser: any) => {
  const resp = await firebase
    .firestore()
    .collection('users')
    .doc(authUser.uid as string)
    .set({ ...authUser }, { merge: true });
  return resp;
};

export const addQuiz = async (quizData) => {
  let response = await firebase.firestore().collection('quiz').add(quizData);
  return response;
};

export const getAllQuiz = async (filter: FilterQuiz) => {
  const quizRef = firebase.firestore().collection('quiz')
  let quizQuery: any
  if (filter.discipline) {
    quizQuery = quizRef.where('discipline', '==', filter.discipline)
  }
  if (filter.subject) {
    quizQuery = (quizQuery || quizRef).where('subject', '==', filter.subject)
  }
  const snapshot = await (quizQuery || quizRef).get();
  const quiz = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  return quiz;
};

export const getAllUsers = async (filter: FilterUser = {}) => {
  const usersRef = firebase.firestore().collection('users')
  let usersQuery: any
  if (filter.ids?.length) {
    usersQuery = usersRef.where(firebase.firestore.FieldPath.documentId(), 'in', filter.ids)
  }
  const snapshot = await (usersQuery || usersRef).get()
  const users = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  return users;
}

export const getSingleQuiz = async (quizId) => {
  const snapshot = await firebase
    .firestore()
    .collection('quiz')
    .doc(String(quizId))
    .get();
  const quizData = snapshot.exists ? JSON.stringify(snapshot.data()) : null;
  return quizData;
};

export const addAnswer = async (data) => {
  const response = await firebase.firestore().collection('answer').add(data);
  return response;
};

export const getAllDisciplines = async () => {
  // const snapshot = await firebase.firestore().collection('disciplines').get()
  // const disciplines = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  // return disciplines
  const result = disciplines.map((item) => ({ id: item.id, name: item.nome }))
  return result
}

export const getAllSubjectsByDiscipline = async (disciplineId: string) => {
  // const snapshot = await firebase.firestore().collection('disciplines').doc(disciplineId).collection('subjects').get()
  // const subjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  // return subjects
  const data: Array<any> = subjects[disciplineId] || []
  const result = data.map((item) => ({ id: item.id, name: item.name }))
  return result
}

export const getAnswer = async (answerId) => {
  const answerSnapshot = await firebase
    .firestore()
    .collection('answer')
    .doc(String(answerId))
    .get();
  let answerData = answerSnapshot.exists
    ? JSON.stringify(answerSnapshot.data())
    : null;
  return answerData;
};