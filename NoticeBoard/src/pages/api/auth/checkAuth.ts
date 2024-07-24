import { NextApiRequest, NextApiResponse } from 'next';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ authenticated: true });
};

export default authMiddleware(handler);