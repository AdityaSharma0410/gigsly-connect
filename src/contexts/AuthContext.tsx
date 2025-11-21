import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';
import type { ApiUser, AuthResponse, UserRole } from '@/types/api';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  signup: (payload: { fullName: string; email: string; password: string; role: UserRole }) => Promise<ApiUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeSession = (data: AuthResponse, setUser: (user: ApiUser) => void, setToken: (token: string) => void) => {
  authStorage.setToken(data.token);
  authStorage.setUser(data.user);
  setToken(data.token);
  setUser(data.user);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(() => authStorage.getUser());
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<ApiUser>('/auth/me');
      setUser(data);
      authStorage.setUser(data);
    } catch {
      authStorage.clear();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser();
  }, [token, refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    storeSession(data, setUser, setToken);
    return data.user;
  };

  const signup = async (payload: { fullName: string; email: string; password: string; role: UserRole }) => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload);
    storeSession(data, setUser, setToken);
    return data.user;
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
