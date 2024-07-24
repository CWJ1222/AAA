import { JwtPayload } from 'jsonwebtoken';
import { ResultSetHeader } from 'mysql2';
import { NextApiRequest, NextApiResponse } from 'next';
import authMiddleware from '../../../middleware/authMiddleware';
import connection from '../../../utils/db';

// Extended type to include user with string id
interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: JwtPayload & { id: string };
}

const handler = async (
  req: AuthenticatedNextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    // Ensure that req.user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;

    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM posts WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ message: 'Post not found or user not authorized' });
      } else {
        res.status(200).json({ message: 'Post deleted' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
