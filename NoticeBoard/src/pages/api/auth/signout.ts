import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const signOutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: -1,
      path: '/',
    })
  );

  res.status(200).json({ message: 'Sign out successful' });
};

export default signOutHandler;