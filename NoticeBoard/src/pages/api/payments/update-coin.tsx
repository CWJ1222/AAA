// import mysql from 'mysql2/promise';
import type { NextApiRequest, NextApiResponse } from "next";
import connection from '../../../utils/db';

export default async function handler(  req: NextApiRequest,
    res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Missing email or amount' });
    }

    try {
      const [rows] = await connection.execute(
        'UPDATE users SET coin = coin + ? WHERE email = ?',
        [amount, email]
      );

      res.status(200).json({ message: 'Coin updated successfully', rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    } finally {
      connection.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}