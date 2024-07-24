import { useRouter } from 'next/router';
import { useState } from 'react';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname) {
      setError('Nickname is required');
      return;
    }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nickname }),
    });

    if (res.ok) {
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/signin');
    } else {
      const data = await res.json();
      if (res.status === 409) {
        alert('이미 등록된 이메일입니다.');
      } else {
        setError(data.message || 'Failed to sign up');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <p className='text-red-500 text-center'>{error}</p>}
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
          <input
            type='text'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder='Nickname'
            className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
            required
          />
          <button
            type='submit'
            className='w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-500 transition-colors'
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUpForm;
