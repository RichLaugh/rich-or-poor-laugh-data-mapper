import { useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import * as authService from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async (authToken: string) => {
    try {
      const userData = await authService.getCurrentUser(authToken);
      setUser(userData);
    } catch (err) {
      setError('Failed to load user data');
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      await loadUser(response.access_token);
    } catch (err) {
      setError('Login failed');
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      await authService.register(credentials);
      await login(credentials);
    } catch (err) {
      setError('Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    location.reload();
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
  };
}