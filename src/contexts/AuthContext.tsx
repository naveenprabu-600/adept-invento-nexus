import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: 'Admin' | 'Manager' | 'Sales';
  };
  isActive: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - in real app this would come from backend
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Admin',
    email: 'admin@adeptinvento.com',
    password: 'admin123',
    role: { name: 'Admin' },
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Manager',
    email: 'manager@adeptinvento.com',
    password: 'manager123',
    role: { name: 'Manager' },
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Sales',
    email: 'sales@adeptinvento.com',
    password: 'sales123',
    role: { name: 'Sales' },
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('adept-invento-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser && foundUser.isActive) {
      const userSession = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        role: foundUser.role,
        isActive: foundUser.isActive,
        lastLogin: new Date().toISOString(),
      };
      
      setUser(userSession);
      localStorage.setItem('adept-invento-user', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adept-invento-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}