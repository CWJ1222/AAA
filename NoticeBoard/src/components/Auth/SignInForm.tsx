import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { reloadUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      await reloadUser();
      alert('로그인이 완료되었습니다.');
      router.push('/board').then(() => {
        window.location.reload();
      });
    } else {
      alert('등록된 회원이 아니거나 잘못 입력하였습니다.');
      console.error('Failed to sign in');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign In</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
            required
          />
          <button
            type='submit'
            className='w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-500 transition-colors'
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
