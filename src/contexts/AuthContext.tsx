import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'professional';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: 'client' | 'professional') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  { id: '1', email: 'client@test.com', password: 'password', fullName: 'Test Client', role: 'client' as const },
  { id: '2', email: 'pro@test.com', password: 'password', fullName: 'Test Professional', role: 'professional' as const },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('gigsly_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('gigsly_user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (email: string, password: string, fullName: string, role: 'client' | 'professional') => {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      fullName,
      role,
    };

    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('gigsly_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gigsly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
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
