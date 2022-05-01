import { NextApiRequest, NextApiResponse } from 'next';
import { getAllSubjectsByDiscipline as getAllSubjectsByDisciplineDb } from '../../../../../services/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await getAllSubjectsByDiscipline(req, res);
      break;
    default:
      res.status(405).json({ status: false, message: 'Method Not found' });
      break;
  }
};

const getAllSubjectsByDiscipline = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const disciplineId = String(req.query.id);
    const subjects = await getAllSubjectsByDisciplineDb(disciplineId);
    return res
      .status(200)
      .json({ result: subjects });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
};