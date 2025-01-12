import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import {toast} from 'react-toastify';

const API_URL = import.meta.env.VITE_APP_HOST;

export async function register(credentials: RegisterCredentials): Promise<void> {
  if (credentials.username.length === 0 || credentials.password.length === 0) {
    toast.error('Username and Password must not be empty');
  }
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const responseBody = await response.json();
    toast.info(`User: ${responseBody.username} successfuly registered`)
  }
  if (!response.ok) {
    throw new Error('Registration failed');
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user data');
  }

  return response.json();
}
