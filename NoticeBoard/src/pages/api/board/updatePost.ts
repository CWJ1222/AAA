import { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../../utils/db';
import authMiddleware from '../../../middleware/authMiddleware';
import { ResultSetHeader, FieldPacket } from 'mysql2';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id, title, content, coin } = req.body;

    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    try {
      // Execute the update query
      const [result, fields]: [ResultSetHeader, FieldPacket[]] = await connection.query(
        'UPDATE posts SET title = ?, content = ?, coin = ? WHERE id = ? AND user_id = ?',
        [title, content,coin, id, userId]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Post not found or user not authorized' });
      } else {
        res.status(200).json({ message: 'Post updated' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);