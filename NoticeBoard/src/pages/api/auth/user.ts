import { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../../utils/db';
import authMiddleware from '../../../middleware/authMiddleware';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
  };
}

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows]: [any[], any] = await connection.query('SELECT email, nickname, coin, created_at FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default authMiddleware(handler);