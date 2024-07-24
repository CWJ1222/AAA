import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../utils/auth';
import connection from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password, nickname } = req.body;
    if (!nickname) {
      return res.status(400).json({ message: 'Nickname is required' });
    }
    try {
      // 이메일 중복 확인
      const [existingUsers]: any = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const hashedPassword = await hashPassword(password);
      await connection.query(
        'INSERT INTO users (email, nickname, password, coin) VALUES (?, ?, ?, ?)',
        [email, nickname, hashedPassword, 0]
      );
      res.status(201).json({ message: 'User created' });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;