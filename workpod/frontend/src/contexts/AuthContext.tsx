import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRefreshSessionMutation } from '@/store/api/auth';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUser: (user: any) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [refreshSession] = useRefreshSessionMutation();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Validate stored token
          await refreshSession().unwrap();
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          debugLog('auth', 'Session validation failed', { error });
          // Clear invalid session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();
  }, [refreshSession]);

  const login = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    showToast.success('Logged out successfully');
  };

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUser,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 