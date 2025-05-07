import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  interests?: string[];
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for demo purposes
const USERS_STORAGE_KEY = 'school_events_users';
const CURRENT_USER_KEY = 'school_events_current_user';

const defaultAdmin = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@school.edu',
  password: 'admin123',
  isAdmin: true,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock database if needed
  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!savedUsers) {
      const initialUsers = JSON.stringify([
        { ...defaultAdmin },
        {
          id: 'user-1',
          name: 'John Student',
          email: 'john@school.edu',
          password: 'password123',
          isAdmin: false,
          interests: ['Sports', 'Music'],
        },
      ]);
      localStorage.setItem(USERS_STORAGE_KEY, initialUsers);
    }

    // Check if a user is already logged in
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const users = getUsers();
      const user = users.find((u: any) => 
        u.email === email && 
        u.password === password && 
        !u.isAdmin
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const users = getUsers();
      const admin = users.find((u: any) => 
        u.email === email && 
        u.password === password && 
        u.isAdmin
      );

      if (admin) {
        const { password, ...adminWithoutPassword } = admin;
        setCurrentUser(adminWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminWithoutPassword));
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const users = getUsers();
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        isAdmin: false,
        interests: [],
      };
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const value = {
    currentUser,
    login,
    adminLogin,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};