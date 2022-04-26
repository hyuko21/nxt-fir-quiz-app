import axios from 'axios';

export const addQuizApi = async (auth, values) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      token: auth.token,
    };
    const resp = await axios.post('/api/quiz', values, { headers: header });
    return resp;
  } catch (error) {
    throw error;
  }
};

export const addAnswerApi = async (auth, quizId, values) => {
  try {
    const header = {
      'Content-Type': 'application/json',
      token: auth.token,
    };
    const resp = await axios.post(
      `/api/quiz/${quizId}/answer`,
      {
        questions: values,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { headers: header }
    );
    return resp;
  } catch (error) {
    throw error;
  }
};

export const getAllDisciplinesApi = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const resp = await axios.get('/api/disciplines', { headers });
    return resp;
  } catch (error) {
    throw error;
  }
};

export const getAllSubjectsByDisciplineApi = async (disciplineId: string) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const resp = await axios.get(`/api/disciplines/${disciplineId}/subjects`, { headers });
    return resp;
  } catch (error) {
    throw error;
  }
};
