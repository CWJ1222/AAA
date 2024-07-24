import { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../../utils/db';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { title, content, coin } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Start a transaction
      await connection.query('START TRANSACTION');

      // Check the user's current coin balance
      const [userRows]: any = await connection.query('SELECT coin FROM users WHERE id = ?', [userId]);
      if (userRows.length === 0) {
        await connection.query('ROLLBACK');
        return res.status(404).json({ message: 'User not found' });
      }

      const userCoin = userRows[0].coin;
      if (userCoin < coin) {
        await connection.query('ROLLBACK');
        return res.status(400).json({ message: 'Insufficient coins' });
      }

      // Deduct coins from the user's balance
      await connection.query('UPDATE users SET coin = coin - ? WHERE id = ?', [coin, userId]);

      // Create the post with the specified coin amount
      await connection.query('INSERT INTO posts (title, content, user_id, coin) VALUES (?, ?, ?, ?)', [title, content, userId, coin]);

      // Commit the transaction
      await connection.query('COMMIT');
      res.status(201).json({ message: 'Post created' });
    } catch (error: any) {
      await connection.query('ROLLBACK');
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);