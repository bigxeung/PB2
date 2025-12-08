import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth';

interface UseAuthReturn {
  user: string | null;
  isLoggedIn: boolean;
  checkAuth: () => void;
  logout: () => void;
}

/**
 * 인증 상태를 관리하는 커스텀 훅
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (authenticated) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  };

  const handleLogout = (): void => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    isLoggedIn,
    checkAuth,
    logout: handleLogout
  };
}

export default useAuth;
