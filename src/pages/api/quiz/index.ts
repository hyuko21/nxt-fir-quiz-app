import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/firebase-admin';
import { addQuiz as addQuizFb, getAllQuiz as getAllQuizDb, getAllUsers } from '../../../services/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await addQuiz(req, res);
      break;
    case 'GET':
      await getAllQuiz(req, res);
      break;
    default:
      res.status(405).json({ status: false, message: 'Method Not found' });
      break;
  }
};

const addQuiz = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await auth.verifyIdToken(req.headers.token as string);
    const quizData = { ...req.body, userId: user.uid };
    await addQuizFb(quizData);
    return res
      .status(200)
      .json({ status: true, message: 'Quiz added successfully...' });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
};

const getAllQuiz = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filter = {
      discipline: req.query.discipline as string,
      subject: req.query.subject as string
    };
    const quizzes = await getAllQuizDb(filter);
    const users = await getAllUsers({
      ids: quizzes.map((quiz: any) => quiz.userId)
    });
    const data = quizzes.map((quiz: any) => {
      return { ...quiz, user: users.find((user) => user.id === quiz.userId)};
    });
    return res
      .status(200)
      .json({ result: data });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
};
