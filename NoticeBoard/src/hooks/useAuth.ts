// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User } from '../../types/User'; // Import the User type

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Type the user state

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const userData: User = await res.json(); // Type the response data
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const reloadUser = async () => {
    const res = await fetch('/api/auth/user');
    if (res.ok) {
      const userData: User = await res.json(); // Type the response data
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
  };

  return { user, reloadUser, signOut };
};

export default useAuth;