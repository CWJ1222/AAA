import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import connection from '../../../utils/db';
import { comparePassword, generateToken } from '../../../utils/auth';
import cookie from 'cookie';

// Define the User type
interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const [rows]: [User[], any] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })
    );

    res.status(200).json({ token });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default loginHandler;