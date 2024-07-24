import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserPayload } from '../types/next';

const authMiddleware = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload;

    // Type guard to ensure decoded is of type JwtPayload
    if (typeof decoded === 'object' && 'id' in decoded) {
      req.user = decoded as UserPayload;
      return handler(req, res);
    } else {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export default authMiddleware;