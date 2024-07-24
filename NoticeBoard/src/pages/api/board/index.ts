import { NextApiRequest, NextApiResponse } from 'next';
import connection from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;

  try {
    let sql = 'SELECT posts.id, posts.title, posts.content, posts.coin, posts.created_at, users.nickname AS author FROM posts JOIN users ON posts.user_id = users.id';
    let params: string[] = [];

    if (query) {
      sql += ' WHERE posts.title LIKE ? OR posts.content LIKE ?';
      const likeQuery = `%${query}%`;
      params = [likeQuery, likeQuery];
    }

    sql += ' ORDER BY posts.created_at DESC';

    const [rows] = await connection.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;