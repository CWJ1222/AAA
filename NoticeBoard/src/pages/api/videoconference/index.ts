import { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../../utils/db';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.user.id;

  if (req.method === 'GET') {
    try {
      const [rows] = await connection.query(
        'SELECT * FROM videoconferences WHERE created_by = ? OR status = "pending"',
        [userId]
      );
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else if (req.method === 'POST') {
    const { title, description } = req.body;

    try {
      await connection.query(
        'INSERT INTO videoconferences (title, description, created_by, status) VALUES (?, ?, ?, "pending")',
        [title, description, userId]
      );
      res.status(201).json({ message: 'Video conference created' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);