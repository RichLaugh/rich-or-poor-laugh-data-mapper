import React, { useState } from 'react';
import { LoginCredentials } from '../types/auth';

interface AuthFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  type: 'login' | 'register';
}

export function AuthForm({ onSubmit, onRegister, type }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await onSubmit({ username, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await onRegister({ username, password });
      handleSubmit(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
      <>
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
              <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                  </label>
                  <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
              </div>

              <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                  </label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                  />
              </div>

              {error && (
                  <div className="text-red-600 text-sm">{error}</div>
              )}
              <div className="text-center flex justify-between">
                  <button
                      type="submit"
                      className="w-60 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >{type === 'login' ? 'Sign In' : 'Sign Up'}</button>
                  <button
                      onClick={handleRegister}
                      className="w-20 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >Register</button>
              </div>

          </form>
      </>
  );
}
