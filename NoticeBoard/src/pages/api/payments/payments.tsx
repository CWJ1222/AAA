import type { NextApiRequest, NextApiResponse } from "next";
import connection from '../../../utils/db';

async function updateCoin(email: string, amount: number) {
  const query = 'UPDATE users SET coin = coin + ? WHERE email = ?';
  const values = [amount/10, email];

  try {
    const [rows] = await connection.execute(query, values);
    console.log('Coin updated successfully:', rows);
    return rows;
  } catch (error) {
    console.error('Failed to update coin:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderId, paymentKey, amount, email } = req.query;
  const secretKey = process.env.TOSS_SECRET_KEY;
  // const { user, signOut } = useAuth();

  console.log('결제완료 페이지'); // 로그 확인을 위해 추가

  if (typeof orderId !== "string" || typeof paymentKey !== "string" || typeof amount !== "string" || typeof email !== "string") {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const url = "https://api.tosspayments.com/v1/payments/confirm";
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

  try {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify({
        amount,
        orderId,
        paymentKey,
      }),
      headers: {
        Authorization: `Basic ${basicToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      res.status(response.status).json(result);
      return;
    }

    // console.log('Payment confirmation result:', result); // 결제 확인 결과 로그

    // 코인 업데이트 처리
    try {
      await updateCoin(email, parseInt(amount, 10));
      console.log('Coin updated successfully');
    } catch (error) {
      console.error('Failed to update coin:', error);
      res.status(500).json({ error: "Failed to update coin" });
      return;
    }

    res.redirect(`http://localhost:3000/board`);
  } catch (error) {
    console.error('Internal Server Error:', error); // 내부 서버 오류 로그
    res.status(500).json({ error: "Internal Server Error" });
  }
}