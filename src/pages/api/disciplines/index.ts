import { NextApiRequest, NextApiResponse } from 'next';
import { getAllDisciplines as getAllDisciplinesDb } from '../../../services/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      await getAllDisciplines(req, res);
      break;
    default:
      res.status(405).json({ status: false, message: 'Method Not found' });
      break;
  }
};

const getAllDisciplines = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const disciplines = await getAllDisciplinesDb();
    return res
      .status(200)
      .json({ result: disciplines });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Something went wrong' });
  }
};
