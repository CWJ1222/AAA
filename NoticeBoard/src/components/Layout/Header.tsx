import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface PaymentModalProps {
  onClose: () => void;
  onPaymentSelect: (amount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentSelect }) => {
  const handlePayment = (amount: number) => {
    alert(`${amount}원 selected`);
    onClose();
    onPaymentSelect(amount);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-slate-600 p-8 rounded shadow-lg w-80 relative z-10'>
        <h2 className='text-xl font-bold mb-4'>Select Amount</h2>
        <div className='flex flex-col space-y-4'>
          <button
            className='bg-gray-800 text-white py-2 rounded'
            onClick={() => handlePayment(3000)}
          >
            3,000원
          </button>
          <button
            className='bg-gray-800 text-white py-2 rounded'
            onClick={() => handlePayment(5000)}
          >
            5,000원
          </button>
          <button
            className='bg-gray-800 text-white py-2 rounded'
            onClick={() => handlePayment(10000)}
          >
            10,000원
          </button>
        </div>
        <button
          className='mt-4 bg-red-500 text-white py-2 rounded w-full'
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
    </div>
  );
};

const Header: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  const handleSignOut = async () => {
    await signOut();
    alert('로그아웃 되었습니다.');
    router.push('/');
  };

  const handlePaymentSelect = (amount: number) => {
    setPaymentAmount(amount);
    setShowPaymentModal(false);
    handleClick(amount); // Call handleClick with the selected amount
  };

  const handleClick = async (amount: number) => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

    if (!clientKey) {
      throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY is not defined");
    }

    const tossPayments = await loadTossPayments(clientKey);
    await tossPayments.requestPayment("카드", {
      amount: amount,
      orderId: Math.random().toString(36).slice(2),
      orderName: `${amount / 10}코인`,
      successUrl: `${window.location.origin}/api/payments/payments?email=${user?.email}`,
      failUrl: `${window.location.origin}/api/payments/fail`,
    });
  };

  return (
    <header className='bg-gray-800 text-white p-4'>
      <nav className='flex justify-between container mx-auto'>
        <div>
          <Link href='/' legacyBehavior>
            <a className='text-xl font-bold mr-4'>NoticeBoard</a>
          </Link>
          <Link href='/board' legacyBehavior>
            <a className='mr-4' style={{ color: 'yellow' }}>
              Board
            </a>
          </Link>

        </div>
        <div className='flex items-center'>
          {user ? (
            <div className='relative'>
                        <a
            className='mr-4'
            style={{ color: 'orange' }}
            onClick={() => setShowPaymentModal(true)}
            role='button'
          >
            Payment
          </a>
              <button
                onClick={() => setShowInfo((prev) => !prev)}
                className='bg-blue-500 text-white px-2 py-1 rounded'
              >
                My Info
              </button>
              {showInfo && (
                <div className='absolute right-0 mt-2 w-60 bg-white text-black rounded shadow-lg p-4'>
                  <p className='text-xs'>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className='text-xs'>
                    <strong>Nickname:</strong> {user.nickname}
                  </p>
                  <p className='text-xs'>
                    <strong>Coins:</strong> {user.coin}
                  </p>
                  <p className='text-xs'>
                    <strong>Joined:</strong>
                    {''}
                    {new Date(
                      new Date(user.created_at).getTime()
                    ).toLocaleString('ko-KR')}{' '}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className='bg-red-500 text-white px-2 py-1 rounded mt-2'
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href='/signin' legacyBehavior>
                <a className='mr-4'>Sign In</a>
              </Link>
              <Link href='/signup' legacyBehavior>
                <a>Sign Up</a>
              </Link>
            </>
          )}
        </div>
      </nav>
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onPaymentSelect={handlePaymentSelect} />}
    </header>
  );
};
export default Header;
