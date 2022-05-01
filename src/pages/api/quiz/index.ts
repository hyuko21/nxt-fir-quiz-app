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
    const userToken = await auth.verifyIdToken(req.headers.token as string, true);
    const user = await auth.getUser(userToken.uid);
    const quizData = { ...req.body, user: { id: user.uid, name: user.displayName }};
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
    return res
      .status(200)
      .json({ result: quizzes });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
};
