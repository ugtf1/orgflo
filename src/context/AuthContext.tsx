import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => { success: boolean; message?: string; role?: Role };
  logout: () => void;
  quickLogin: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'mem-101',
  username: 'admin',
  name: 'Sarah Jenkins',
  email: 'admin@orgflow.com',
  role: 'admin',
  memberId: 'mem-101',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
};

const MEMBER_USER: User = {
  id: 'mem-102',
  username: 'member',
  name: 'Alex Morgan',
  email: 'member@orgflow.com',
  role: 'member',
  memberId: 'mem-102',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('orgflo_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('orgflo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('orgflo_user');
    }
  }, [user]);

  const login = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanPass !== 'pass123') {
      return { success: false, message: 'Invalid credentials. Password should be pass123' };
    }

    if (cleanUser === 'admin' || cleanUser === 'admin@orgflow.com') {
      setUser(ADMIN_USER);
      return { success: true, role: 'admin' as Role };
    } else if (cleanUser === 'member' || cleanUser === 'member@orgflow.com') {
      setUser(MEMBER_USER);
      return { success: true, role: 'member' as Role };
    }

    return { success: false, message: 'Invalid username. Use "admin" or "member".' };
  };

  const quickLogin = (role: Role) => {
    if (role === 'admin') {
      setUser(ADMIN_USER);
    } else {
      setUser(MEMBER_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        quickLogin
      }}
    >
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
