import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode a mock JWT or a real JWT payload (claims)
const decodeToken = (token: string): Partial<User> => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id || payload.sub,
      username: payload.username || payload.name,
      email: payload.email,
    };
  } catch (e) {
    console.error('Failed to decode JWT token:', e);
    return {};
  }
};

// Simple mock token generator when backend is not online
const generateMockJWT = (payload: object): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 }));
  const signature = 'mock_signature_from_chaidrive';
  return `${header}.${data}.${signature}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('chaidrive_token');
    if (storedToken) {
      const claims = decodeToken(storedToken);
      if (claims.email) {
        setToken(storedToken);
        setUser({
          id: claims.id || 'mock-id',
          username: claims.username || 'User',
          email: claims.email,
          token: storedToken,
        });
      } else {
        localStorage.removeItem('chaidrive_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Attempt backend login first. If it fails, fall back to mock login.
      let fetchedToken = '';
      let fetchedUser: User | null = null;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const data = await response.json();
          fetchedToken = data.token;
        }
      } catch (err) {
        console.warn('Backend API login failed or offline. Simulating mock login.', err);
      }

      if (!fetchedToken) {
        // Fallback simulated login
        if (!email.includes('@') || password.length < 4) {
          throw new Error('Invalid credentials. Email must be valid and password at least 4 chars.');
        }
        const username = email.split('@')[0];
        fetchedToken = generateMockJWT({ id: 'u-' + Date.now(), username, email });
      }

      const claims = decodeToken(fetchedToken);
      fetchedUser = {
        id: claims.id || 'u-' + Date.now(),
        username: claims.username || 'User',
        email: claims.email || email,
        token: fetchedToken,
      };

      setToken(fetchedToken);
      setUser(fetchedUser);
      localStorage.setItem('chaidrive_token', fetchedToken);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Attempt backend register first. If it fails, fall back to mock registration.
      let fetchedToken = '';
      let fetchedUser: User | null = null;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        if (response.ok) {
          const data = await response.json();
          fetchedToken = data.token;
        }
      } catch (err) {
        console.warn('Backend API register failed or offline. Simulating mock register.', err);
      }

      if (!fetchedToken) {
        if (!email.includes('@') || password.length < 4 || username.trim() === '') {
          throw new Error('Invalid register details. Fill all inputs correctly.');
        }
        fetchedToken = generateMockJWT({ id: 'u-' + Date.now(), username, email });
      }

      const claims = decodeToken(fetchedToken);
      fetchedUser = {
        id: claims.id || 'u-' + Date.now(),
        username: claims.username || username,
        email: claims.email || email,
        token: fetchedToken,
      };

      setToken(fetchedToken);
      setUser(fetchedUser);
      localStorage.setItem('chaidrive_token', fetchedToken);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('chaidrive_token');
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    const response = await fetch(url, { ...options, headers });
    
    // Auto-logout on 401 Unauthorized
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }
    
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
