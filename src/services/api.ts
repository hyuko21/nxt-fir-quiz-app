import { FilterQuiz } from './db';
import axios, { Method } from 'axios';

type RequestType = {
  method: Method,
  url: string
  options: {
    params?: any,
    body?: any
    headers?: any
  }
}

const doRequest = ({ method, url, options }: RequestType) => {
  try {
    return axios.request({
      method,
      url,
      data: /p(?:ost|ut|atch)/i.test(method) ? options.body : undefined,
      params: options.params,
      headers: options.headers
    })
  } catch (error) {
    throw error
  }
}

export const getAllQuizzesApi = async (filter: FilterQuiz) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  return doRequest({ method: 'GET', url: '/api/quiz', options: { headers, params: filter }})
}

export const addQuizApi = async (auth, values) => {
  const headers = {
    'Content-Type': 'application/json',
    token: auth.token,
  };
  return doRequest({ method: 'POST', url: '/api/quiz', options: { headers, body: values }})
};

export const addAnswerApi = async (auth, quizId, values) => {
  const headers = {
    'Content-Type': 'application/json',
    token: auth.token,
  };
  return doRequest({
    method: 'POST',
    url: `/api/quiz/${quizId}/answer`,
    options: {
      headers,
      body: {
        questions: values,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  });
};

export const getAllDisciplinesApi = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return doRequest({ method: 'GET', url: '/api/disciplines', options: { headers }});
};

export const getAllSubjectsByDisciplineApi = async (disciplineId: string) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return doRequest({
    method: 'GET',
    url: `/api/disciplines/${disciplineId}/subjects`,
    options: { headers }
  });
};
